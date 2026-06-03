import { Link } from '@inertiajs/react';
import { Star } from 'lucide-react';

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  duration: string | null;
  rating: number;
  category: string;
  active: boolean;
}

export function ServiceCard({ name, description, image, rating, category, active }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full bg-muted overflow-hidden">
        <img
          src={image || '/placeholder.svg'}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg text-foreground">{name}</h3>
          <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-full">
            <Star size={14} className="fill-accent text-accent" />
            <span className="text-xs font-semibold text-accent">{rating}</span>
          </div>
        </div>

        <p className="text-sm text-default-500 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between text-xs text-default-500" />

        {active ? (
          <Link href={`/booking?service=${category}`} className="w-full">
            <button className="w-full bg-primary hover:bg-primary/90 text-white inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 transition-colors">Pesan Sekarang</button>
          </Link>
        ) : (
          <button disabled className="w-full bg-primary/50 text-white inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 cursor-not-allowed opacity-50">Pesan Sekarang</button>
        )}
      </div>
    </div>
  );
}
