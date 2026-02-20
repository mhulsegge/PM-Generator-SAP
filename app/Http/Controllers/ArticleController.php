<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\ArticlesImport;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::latest()->paginate(20);
        return Inertia::render('articles/index', [
            'articles' => $articles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'article_number' => 'required|string|unique:articles,article_number',
            'description' => 'required|string',
            'unit' => 'required|string',
        ]);

        Article::create($validated);
        return back()->with('success', 'Artikel toegevoegd.');
    }

    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'description' => 'required|string',
            'unit' => 'required|string',
        ]);

        $article->update($validated);
        return back()->with('success', 'Artikel gewijzigd.');
    }

    public function destroy(Article $article)
    {
        $article->delete();
        return back()->with('success', 'Artikel verwijderd.');
    }

    public function importUpload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt,xlsx,xls|max:10240',
        ]);

        try {
            $path = $request->file('file')->store('imports');
            $headersData = (new \Maatwebsite\Excel\HeadingRowImport)->toArray(storage_path('app/private/' . $path));
            $headers = $headersData[0][0] ?? [];

            return Inertia::render('articles/import-mapping', [
                'filePath' => $path,
                'headers' => $headers,
            ]);
        } catch (\Exception $e) {
            return back()->with('error', 'Fout bij het inlezen van bestand: ' . $e->getMessage());
        }
    }

    public function importProcess(Request $request)
    {
        $request->validate([
            'file_path' => 'required|string',
            'mapping' => 'required|array',
            'mapping.article_number' => 'required|string',
            'mapping.description' => 'required|string',
        ]);

        try {
            $import = new ArticlesImport($request->mapping);
            Excel::import($import, storage_path('app/private/' . $request->file_path));

            \Illuminate\Support\Facades\Storage::delete($request->file_path);

            $importedCount = $import->getImportedCount();
            $skippedCount = $import->getSkippedCount();

            $message = "Succesvol {$importedCount} artikelen geïmporteerd.";
            if ($skippedCount > 0) {
                $message .= " ({$skippedCount} overgeslagen ivm ontbrekende data).";
            }

            return redirect()->route('articles.index')->with('success', $message);
        } catch (\Exception $e) {
            return redirect()->route('articles.index')->with('error', 'Fout bij het importeren: ' . $e->getMessage());
        }
    }
}
