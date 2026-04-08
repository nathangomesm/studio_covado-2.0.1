"use client";
import { useState } from "react";

export default function AdminNovoProjeto() {
  const [loading, setLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]); // Guarda as imagens para mostrar na tela

  // Função que roda quando você escolhe as imagens no computador
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      // Cria uma URL temporária para cada imagem selecionada
      const urls = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const files = formData.getAll('imagens') as File[];
    if (files.length === 0 || files[0].size === 0) {
      alert("Por favor, selecione pelo menos uma imagem.");
      setLoading(false);
      return;
    }
    
    // ATENÇÃO: Aqui ele está chamando a API!
    const res = await fetch('/api/admin/projetos', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      alert("Projeto cadastrado com sucesso!");
      (e.target as HTMLFormElement).reset();
      setPreviewUrls([]); // Limpa as imagens da tela depois de salvar
    } else {
      alert("Erro ao cadastrar o projeto. Verifique o console.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-bege p-12 pt-[220px]">
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg">
        <h1 className="font-titulos text-3xl mb-8 text-carvalho border-b pb-4">Novo Projeto</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="titulo" placeholder="Título do Projeto" className="border p-3 w-full" required />
            <select name="categoriaId" className="border p-3 w-full" required>
              <option value="">Selecione a Categoria</option>
              {/* Ajuste esses IDs conforme o que estiver no seu banco de dados no Prisma Studio */}
              <option value="1">Residencial</option>
              <option value="2">Comercial</option>
            </select>
          </div>

          <textarea name="descricao" placeholder="Descrição completa" className="border p-3 w-full h-32" required />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <input name="cliente" placeholder="Cliente" className="border p-2" />
            <input name="localizacao" placeholder="Localização" className="border p-2" />
            <input name="area" placeholder="Área (ex: 450m²)" className="border p-2" />
            <input name="status" placeholder="Status" className="border p-2" />
          </div>

          <div className="border-2 border-dashed border-areia p-8 text-center bg-gray-50">
            <label className="cursor-pointer block">
              <span className="text-oliva font-bold">Clique para selecionar as imagens (Múltiplas)</span>
              <input 
                type="file" 
                name="imagens" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange} // <--- Ativa a função de preview
              />
            </label>
            <p className="text-xs text-gray-400 mt-2">A primeira imagem será a capa do projeto.</p>
          </div>

          {/* SESSÃO DAS MINIATURAS (PREVIEW) */}
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative aspect-square">
                  <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-md border border-gray-200" />
                  {index === 0 && (
                    <span className="absolute top-1 left-1 bg-carvalho text-white text-[10px] px-2 py-1 rounded-sm shadow-md">
                      CAPA
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-carvalho text-white p-4 uppercase tracking-widest hover:bg-oliva transition-colors disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Cadastrar Projeto"}
          </button>
        </form>
      </div>
    </div>
  );
}