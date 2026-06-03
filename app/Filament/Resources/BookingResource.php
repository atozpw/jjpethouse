<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BookingResource\Pages;
use App\Models\Booking;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\DB;

class BookingResource extends Resource
{
    protected static ?string $model = Booking::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar-days';

    protected static ?string $navigationLabel = 'Booking';

    protected static ?string $modelLabel = 'Booking';

    protected static ?string $navigationGroup = 'Operasional';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Data Booking')->schema([
                    Forms\Components\Select::make('service_id')
                        ->label('Layanan')
                        ->options(fn () => DB::table('services')->orderBy('name')->pluck('name', 'id')->all())
                        ->searchable()
                        ->required(),
                    Forms\Components\Select::make('branch_id')
                        ->label('Cabang')
                        ->options(fn () => DB::table('branches')->orderBy('name')->pluck('name', 'id')->all())
                        ->searchable(),
                    Forms\Components\TextInput::make('booking_number')->label('No. Booking')->required()->maxLength(255),
                    Forms\Components\Select::make('status')->options([
                        'pending' => 'Pending',
                        'confirmed' => 'Confirmed',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                    ])->required()->default('pending'),
                    Forms\Components\DatePicker::make('date')->label('Tanggal'),
                    Forms\Components\TimePicker::make('time')->label('Jam')->seconds(false),
                    Forms\Components\DatePicker::make('check_in')->label('Check In'),
                    Forms\Components\DatePicker::make('check_out')->label('Check Out'),
                ])->columns(2),
                Forms\Components\Section::make('Customer')->schema([
                    Forms\Components\TextInput::make('customer_name')->label('Nama')->required()->maxLength(255),
                    Forms\Components\TextInput::make('customer_email')->label('Email')->email()->maxLength(255),
                    Forms\Components\TextInput::make('customer_phone')->label('Telepon')->tel()->maxLength(255),
                    Forms\Components\TextInput::make('city')->label('Kota')->maxLength(255),
                    Forms\Components\Textarea::make('address')->label('Alamat')->columnSpanFull(),
                    Forms\Components\Textarea::make('notes')->label('Catatan')->columnSpanFull(),
                    Forms\Components\TextInput::make('total_price')->label('Total')->numeric()->default(0)->prefix('Rp'),
                ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('booking_number')->label('No. Booking')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('customer_name')->label('Customer')->searchable(),
                Tables\Columns\TextColumn::make('customer_phone')->label('Telepon')->searchable(),
                Tables\Columns\TextColumn::make('status')->badge()->colors([
                    'warning' => 'pending',
                    'primary' => 'confirmed',
                    'success' => 'completed',
                    'danger' => 'cancelled',
                ]),
                Tables\Columns\TextColumn::make('date')->label('Tanggal')->date('d M Y')->sortable(),
                Tables\Columns\TextColumn::make('total_price')->label('Total')->money('IDR')->sortable(),
                Tables\Columns\TextColumn::make('created_at')->label('Dibuat')->dateTime()->sortable()->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')->options([
                    'pending' => 'Pending',
                    'confirmed' => 'Confirmed',
                    'completed' => 'Completed',
                    'cancelled' => 'Cancelled',
                ]),
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
            'index' => Pages\ListBookings::route('/'),
            'create' => Pages\CreateBooking::route('/create'),
            'edit' => Pages\EditBooking::route('/{record}/edit'),
        ];
    }
}
