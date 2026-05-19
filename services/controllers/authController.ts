import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import supabase from "../config/supabaseClient.ts";
import express from 'express';
import type { Request, Response } from 'express';


export async function signup(req: Request, res: Response) {
  const { phone, password } = req.body as { phone: string; password: string };

  console.log("📝 [SIGNUP] Iniciando cadastro...");
  console.log("📱 [SIGNUP] Telefone recebido:", phone);

  if (!phone || !password) {
    console.log("❌ [SIGNUP] Campos obrigatórios faltando");
    return res.status(400).json({ error: "Preencha os campos obrigatórios" });
  }

  if (!/^\d{9}$/.test(phone)) {
    console.log("❌ [SIGNUP] Telefone inválido:", phone);
    return res.status(400).json({ error: "Telefone deve ter 9 números" });
  }

  if (!/^\d{8}$/.test(password)) {
    console.log("❌ [SIGNUP] Senha inválida");
    return res.status(400).json({ error: "Senha deve ter 8 números" });
  }

  try {
    console.log("🔍 [SIGNUP] Verificando se usuário já existe...");
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("phone")
      .eq("phone", phone);

    console.log("✅ [SIGNUP] Resultado da verificação:", existingUser);
    console.log("⚠️ [SIGNUP] Erro na verificação:", checkError);

    if (existingUser && existingUser.length > 0) {
      console.log("❌ [SIGNUP] Telefone já cadastrado");
      return res.status(400).json({ error: "Telefone já cadastrado" });
    }

    console.log("🔐 [SIGNUP] Hasheando senha...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ [SIGNUP] Senha hasheada com sucesso");

    console.log("💾 [SIGNUP] Inserindo usuário no banco de dados...");
    const { data, error } = await supabase
      .from("users")
      .insert([{ phone, password_hash: hashedPassword }])
      .select();

    console.log("✅ [SIGNUP] Resposta do insert:", data);
    console.log("⚠️ [SIGNUP] Erro do insert:", error);

    if (error) {
      console.log("❌ [SIGNUP] Erro ao inserir:", error.message);
      return res.status(400).json({ error: error.message });
    }

    // ✅ NOVO: Gerar token JWT
    console.log("🔑 [SIGNUP] Gerando token JWT...");
    const token = jwt.sign(
      { id: data[0].id, phone: data[0].phone },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" }
    );
    console.log("✅ [SIGNUP] Token gerado com sucesso");

    console.log("✅ [SIGNUP] Usuário criado com sucesso!");
    return res.status(201).json({
      message: "Cadastro finalizado com sucesso",
      token, // ✅ Retorna o token
      user: data?.[0],
    });
  } catch (err) {
    console.error("❌ [SIGNUP] Erro geral:", err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}


export async function login(req: Request, res: Response) {
  const { phone, password } = req.body as { phone: string; password: string };

  if (!phone || !password) {
    return res.status(400).json({ error: "Preencha os campos obrigatórios" });
  }
  

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .single();

    if (error || !user) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" }
    );

    return res.json({ message: "Login realizado com sucesso", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function resetPassword(req: Request, res: Response) {
  const { phone, newPassword } = req.body as {
    phone: string;
    newPassword: string;
  };

  if (!phone || !newPassword) {
    return res.status(400).json({ error: "Preencha os campos obrigatórios" });
  }
  if (!/^\d{9}$/.test(phone)) {
    return res.status(400).json({ error: "Telefone deve ter 9 números" });
  }
  if (!/^\d{8}$/.test(newPassword)) {
  return res.status(400).json({ error: "Senha deve ter 8 números" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error } = await supabase
      .from("users")
      .update({ password_hash: hashedPassword })
      .eq("phone", phone);

    if (error) return res.status(400).json({ error: error.message });

    return res.json({ message: "Senha redefinida com sucesso" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}

