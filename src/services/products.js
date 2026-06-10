import { supabase } from '../lib/supabase'

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getProduct(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function uploadProductImage(file) {
  const ext = file.name.split('.').pop()
  const path = `${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('products').upload(path, file, { upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from('products').getPublicUrl(path)
  return data.publicUrl
}

export async function createProduct({ name, description, image_url, price, is_active }) {
  const { data, error } = await supabase
    .from('products')
    .insert({ name, description, image_url, price: price || 0, is_active })
    .select()
    .single()
  if (error) throw error
  return data
}
