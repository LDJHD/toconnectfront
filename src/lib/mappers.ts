import { BACKEND_URL } from './api'

export interface BackendArticle {
  id: number
  nom: string
  description?: string
  prix: number
  prixPromo?: number
  stock: number
  actif: boolean
  enVedette: boolean
  categoryId: number
  sousCategoryId?: number
  category?: { id: number; nom: string; slug: string }
  sousCategory?: { id: number; nom: string }
  images?: { id: number; imageUrl: string }[]
  createdAt?: string
}

export interface TemplateProduct {
  id: number
  title: string
  newPrice: number
  oldPrice: number
  waight: string
  image: string
  imageTwo: string
  date: string
  status: string
  rating: number
  location: string
  brand: string
  sku: number
  category: string
  categoryId?: number
  quantity: number
  sale: string
  description?: string
  stock?: number
}

export function mapArticleToProduct(article: BackendArticle): TemplateProduct {
  const img = article.images?.[0]
    ? BACKEND_URL + article.images[0].imageUrl
    : '/assets/img/product-images/6_2.jpg'
  const imgTwo = article.images?.[1]
    ? BACKEND_URL + article.images[1].imageUrl
    : img

  return {
    id: article.id,
    title: article.nom,
    newPrice: article.prixPromo || article.prix,
    oldPrice: article.prix,
    waight: '',
    image: img,
    imageTwo: imgTwo,
    date: article.createdAt || '',
    status: article.stock > 0 ? 'En stock' : 'Rupture',
    rating: 4,
    location: 'Online',
    brand: article.category?.nom || '',
    sku: article.id,
    category: article.category?.nom || '',
    categoryId: article.categoryId,
    quantity: 1,
    sale: article.prixPromo && article.prixPromo < article.prix ? 'Promo' : '',
    description: article.description,
    stock: article.stock,
  }
}

export function mapCategoryToTemplate(cat: any) {
  return {
    id: cat.id,
    title: cat.nom,
    slug: cat.slug,
    image: cat.image ? BACKEND_URL + cat.image : '',
    count: cat.articlesCount || 0,
  }
}
