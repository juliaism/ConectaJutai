import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import supabase from "../config/supabaseClient.ts";
import express from 'express';
import type { Request, Response } from 'express';


export async function signup(req: Request, res: Response) {
  const { phone, password } = req.body as { phone: string; password: string };

  if (!phone || !password) {
    return res.status(400).json({ error: "Preencha os campos obrigatórios" });
  }

  if (!/^\d{9}$/.test(phone)) {
    return res.status(400).json({ error: "Telefone deve ter 9 números" });
  }

  if (!/^\d{8}$/.test(password)) {
    return res.status(400).json({ error: "Senha deve ter 8 números" });
  }

  try {
    console.log("Verificando se usuário já existe...");
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("phone")
      .eq("phone", phone);

    console.log("Resultado da verificação:", existingUser);
    console.log("Erro na verificação:", checkError);

    if (existingUser && existingUser.length > 0) {
      return res.status(400).json({ error: "Telefone já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([{ phone, password_hash: hashedPassword }])
      .select();

    console.log("Resposta do insert:", data);
    console.log("Erro do insert:", error);

    if (error) {
      console.log("Erro ao inserir:", error.message);
      return res.status(400).json({ error: error.message });
    }
    const token = jwt.sign(
      { id: data[0].id, phone: data[0].phone },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" }
    );

    return res.status(201).json({
      message: "Cadastro finalizado com sucesso",
      token, 
      user: data?.[0],
    });
  } catch (err) {
    console.error("Erro geral:", err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}


export async function login(req: Request, res: Response) {
  const { phone, password } = req.body as { phone: string; password: string };

  if (!phone || !password) {
    return res.status(400).json({ error: "Preencha os campos obrigatórios" });
  }

  try {
    const { data: users, error: selectError } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone);

    console.log("Resultado da busca:", users);
    console.log("Erro da busca:", selectError);

    if (selectError) {
      console.log("Erro ao buscar usuário:", selectError.message);
      return res.status(500).json({ error: "Erro ao buscar usuário" });
    }

    if (!users || users.length === 0) {
      console.log("Usuário não encontrado com telefone:", phone);
      return res.status(401).json({ error: "Telefone ou senha incorretos" });
    }

    const user = users[0];
  
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      console.log("Senha incorreta para usuário:", user.id);
      return res.status(401).json({ error: "Telefone ou senha incorretos" });
    }
;
    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" }
    );

    return res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user.id,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Erro geral:", err);
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
