import { supabase } from '../lib/supabase'

export async function getMyInquiries(userId) {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getAllInquiries() {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*, profiles(name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createInquiry({ title, content, userId }) {
  const { data, error } = await supabase
    .from('inquiries')
    .insert({ title, content, user_id: userId })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteInquiry(id) {
  const { error } = await supabase.from('inquiries').delete().eq('id', id)
  if (error) throw error
}
