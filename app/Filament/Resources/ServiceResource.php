<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ServiceResource\Pages;
use App\Models\Service;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\DB;

class ServiceResource extends Resource
{
    protected static ?string $model = Service::class;

    protected static ?string $navigationIcon = 'heroicon-o-sparkles';

    protected static ?string $navigationLabel = 'Layanan';

    protected static ?string $modelLabel = 'Layanan';

    protected static ?string $navigationGroup = 'Operasional';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informasi Layanan')->schema([
                    Forms\Components\Select::make('service_category_id')
                        ->label('Kategori')
                        ->options(fn () => DB::table('service_categories')->orderBy('name')->pluck('name', 'id')->all())
                        ->searchable()
                        ->required(),
                    Forms\Components\TextInput::make('name')->label('Nama')->required()->maxLength(255),
                    Forms\Components\TextInput::make('slug')->required()->maxLength(255),
                    Forms\Components\Textarea::make('description')->label('Deskripsi')->columnSpanFull(),
                    Forms\Components\TextInput::make('price')->label('Harga')->numeric()->default(0)->prefix('Rp'),
                    Forms\Components\TextInput::make('image')->label('Gambar')->maxLength(255),
                    Forms\Components\TextInput::make('duration')->label('Durasi')->maxLength(255),
                    Forms\Components\TextInput::make('rating')->numeric()->default(0),
                    Forms\Components\TextInput::make('url')->maxLength(255),
                ])->columns(2),
                Forms\Components\Section::make('Pengaturan')->schema([
                    Forms\Components\Toggle::make('requires_address')->label('Butuh Alamat'),
                    Forms\Components\Toggle::make('requires_pickup')->label('Butuh Pickup'),
                    Forms\Components\Toggle::make('requires_schedule')->label('Butuh Jadwal')->default(true),
                    Forms\Components\Toggle::make('branch_required')->label('Butuh Cabang')->default(true),
                    Forms\Components\Toggle::make('requires_people')->label('Butuh Staff'),
                    Forms\Components\Select::make('schedule_type')->label('Tipe Jadwal')->options(['single' => 'Single', 'range' => 'Range'])->default('single')->required(),
                    Forms\Components\Toggle::make('active')->label('Aktif')->default(true),
                ])->columns(3),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->label('Nama')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('slug')->searchable(),
                Tables\Columns\TextColumn::make('price')->label('Harga')->money('IDR')->sortable(),
                Tables\Columns\ImageColumn::make('image')->label('Gambar'),
                Tables\Columns\TextColumn::make('duration')->label('Durasi'),
                Tables\Columns\TextColumn::make('rating')->sortable(),
                Tables\Columns\IconColumn::make('active')->label('Aktif')->boolean(),
                Tables\Columns\TextColumn::make('created_at')->dateTime()->sortable()->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('active')->label('Aktif'),
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
            'index' => Pages\ListServices::route('/'),
            'create' => Pages\CreateService::route('/create'),
            'edit' => Pages\EditService::route('/{record}/edit'),
        ];
    }
}
