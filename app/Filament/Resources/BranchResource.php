<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BranchResource\Pages;
use App\Models\Branch;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\DB;

class BranchResource extends Resource
{
    protected static ?string $model = Branch::class;

    protected static ?string $navigationIcon = 'heroicon-o-building-storefront';

    protected static ?string $navigationLabel = 'Cabang';

    protected static ?string $modelLabel = 'Cabang';

    protected static ?string $navigationGroup = 'Operasional';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informasi Cabang')->schema([
                    Forms\Components\Select::make('city_id')
                        ->label('Kota')
                        ->options(fn () => DB::table('cities')->orderBy('name')->pluck('name', 'id')->all())
                        ->searchable()
                        ->required(),
                    Forms\Components\TextInput::make('name')->label('Nama')->required()->maxLength(255),
                    Forms\Components\TextInput::make('slug')->required()->maxLength(255),
                    Forms\Components\Textarea::make('address')->label('Alamat')->required()->columnSpanFull(),
                    Forms\Components\TextInput::make('phone')->label('Telepon')->tel()->maxLength(255),
                    Forms\Components\TextInput::make('whatsapp')->label('WhatsApp')->maxLength(255),
                    Forms\Components\TextInput::make('email')->email()->maxLength(255),
                    Forms\Components\TextInput::make('weekday_hours')->label('Jam Weekday')->maxLength(255),
                    Forms\Components\TextInput::make('weekend_hours')->label('Jam Weekend')->maxLength(255),
                    Forms\Components\TextInput::make('image')->label('Gambar')->maxLength(255),
                    Forms\Components\TextInput::make('lat')->numeric(),
                    Forms\Components\TextInput::make('lng')->numeric(),
                    Forms\Components\Toggle::make('featured')->label('Featured')->default(false),
                    Forms\Components\Toggle::make('active')->label('Aktif')->default(true),
                ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')->label('Gambar'),
                Tables\Columns\TextColumn::make('name')->label('Nama')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('phone')->label('Telepon')->searchable(),
                Tables\Columns\TextColumn::make('whatsapp')->label('WhatsApp')->searchable(),
                Tables\Columns\TextColumn::make('weekday_hours')->label('Weekday'),
                Tables\Columns\TextColumn::make('weekend_hours')->label('Weekend'),
                Tables\Columns\IconColumn::make('featured')->label('Featured')->boolean(),
                Tables\Columns\IconColumn::make('active')->label('Aktif')->boolean(),
                Tables\Columns\TextColumn::make('created_at')->dateTime()->sortable()->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('active')->label('Aktif'),
                Tables\Filters\TernaryFilter::make('featured')->label('Featured'),
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
            'index' => Pages\ListBranches::route('/'),
            'create' => Pages\CreateBranch::route('/create'),
            'edit' => Pages\EditBranch::route('/{record}/edit'),
        ];
    }
}
