<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\DB;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $navigationLabel = 'Produk';

    protected static ?string $modelLabel = 'Produk';

    protected static ?string $navigationGroup = 'Pet Shop';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informasi Produk')->schema([
                    Forms\Components\Select::make('product_category_id')
                        ->label('Kategori')
                        ->options(fn () => DB::table('product_categories')->orderBy('name')->pluck('name', 'id')->all())
                        ->searchable(),
                    Forms\Components\TextInput::make('name')->label('Nama')->required()->maxLength(255),
                    Forms\Components\TextInput::make('slug')->required()->maxLength(255),
                    Forms\Components\Textarea::make('description')->label('Deskripsi')->columnSpanFull(),
                    Forms\Components\TextInput::make('brand')->label('Brand')->maxLength(255),
                    Forms\Components\TextInput::make('pet_type')->label('Jenis Hewan')->maxLength(255),
                    Forms\Components\TextInput::make('price')->label('Harga')->numeric()->default(0)->prefix('Rp'),
                    Forms\Components\TextInput::make('sku')->label('SKU')->maxLength(255),
                    Forms\Components\TextInput::make('stock')->label('Stok')->numeric()->default(0),
                    Forms\Components\TextInput::make('weight')->label('Berat')->numeric()->default(0),
                    Forms\Components\TextInput::make('image')->label('Gambar')->maxLength(255),
                    Forms\Components\Toggle::make('is_active')->label('Aktif')->default(true),
                ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')->label('Gambar'),
                Tables\Columns\TextColumn::make('name')->label('Nama')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('brand')->label('Brand')->searchable(),
                Tables\Columns\TextColumn::make('pet_type')->label('Jenis Hewan')->searchable(),
                Tables\Columns\TextColumn::make('price')->label('Harga')->money('IDR')->sortable(),
                Tables\Columns\TextColumn::make('stock')->label('Stok')->numeric()->sortable(),
                Tables\Columns\IconColumn::make('is_active')->label('Aktif')->boolean(),
                Tables\Columns\TextColumn::make('created_at')->dateTime()->sortable()->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')->label('Aktif'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
