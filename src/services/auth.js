import { supabase } from '../lib/supabase'

export async function signUp({ email, password, name, phone, zipcode, address1, address2 }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, phone, zipcode, address1, address2 } },
  })
  if (error) throw error
  return data
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export async function checkEmailDuplicate(email) {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle()
  return !!data
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function uploadAvatar(userId, file) {
  const ext = file.name.split('.').pop()
  const path = `${userId}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true })
  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  const avatarUrl = `${data.publicUrl}?t=${Date.now()}`

  await updateProfile(userId, { avatar_url: avatarUrl })
  return avatarUrl
}

export async function deleteAvatar(userId) {
  const { data: files } = await supabase.storage
    .from('avatars')
    .list(userId)

  if (files?.length) {
    const paths = files.map(f => `${userId}/${f.name}`)
    await supabase.storage.from('avatars').remove(paths)
  }

  await updateProfile(userId, { avatar_url: null })
}
