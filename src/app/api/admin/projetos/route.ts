import { put } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const formData = await request.formData();

    const titulo = formData.get('titulo') as string;
    const descricao = formData.get('descricao') as string;
    const categoriaId = formData.get('categoriaId') as string;
    const cliente = formData.get('cliente') as string;
    const localizacao = formData.get('localizacao') as string;
    const area = formData.get('area') as string;
    const status = formData.get('status') as string;

    // Pegar todos os arquivos enviados
    const files = formData.getAll('imagens') as File[];

    if (files.length === 0) {
        return NextResponse.json({ error: "Nenhuma imagem enviada" }, { status: 400 });
    }

    // 1. Upload das imagens para o Vercel Blob
    const uploadPromises = files.map(file =>
        put(`projetos/${Date.now()}-${file.name}`, file, { access: 'public' })
    );

    const uploadedBlobs = await Promise.all(uploadPromises);
    const urls = uploadedBlobs.map(blob => blob.url);

    // 2. Salvar no Banco de Dados via Prisma
    const novoProjeto = await prisma.projeto.create({
        data: {
            titulo,
            descricao,
            categoriaId: parseInt(categoriaId, 10), // <-- A MÁGICA AQUI! Transformando string em número
            cliente,
            localizacao,
            area,
            status,
            imagemPrincipal: urls[0],
            ativo: true,
        }
    });

    return NextResponse.json(novoProjeto);
}