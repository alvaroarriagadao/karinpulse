/**
 * Servicio de autenticación para KarinPulse
 */

import { supabase } from './supabase';
import { RegisterData, LoginData, User } from '@/types';

/**
 * Registra un nuevo usuario
 */
export const registerUser = async (data: RegisterData): Promise<{ user: User | null; error: Error | null }> => {
  try {
    // Registrar usuario en Supabase Auth
    // Pasamos los datos adicionales en metadata para que el trigger pueda usarlos
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          rut: data.rut,
          company: data.company,
          position: data.position,
        },
      },
    });

    if (authError) {
      return { user: null, error: authError };
    }

    if (!authData.user) {
      return { user: null, error: new Error('No se pudo crear el usuario') };
    }

    // Validar que todos los campos requeridos estén presentes
    if (!data.rut || !data.company || !data.position) {
      console.error('Datos incompletos en registro:', {
        rut: data.rut,
        company: data.company,
        position: data.position,
      });
      return {
        user: null,
        error: new Error('Faltan datos requeridos: RUT, Empresa o Cargo'),
      };
    }

    // Preparar los datos del perfil con mapeo explícito según la estructura de la BD
    // Estructura BD: id (uuid), email (text), full_name (text), rut (text), 
    // company (text), position (text), created_at (timestamp), updated_at (timestamp)
    const profileDataToInsert = {
      id: authData.user.id,
      email: data.email.trim(),
      full_name: data.fullName.trim(),
      rut: data.rut.trim(),
      company: data.company.trim(),
      position: data.position.trim(),
    };

    console.log('📝 Datos preparados para insertar en BD:', JSON.stringify(profileDataToInsert, null, 2));
    console.log('📋 Verificación de campos:', {
      id: !!profileDataToInsert.id,
      email: !!profileDataToInsert.email,
      full_name: !!profileDataToInsert.full_name,
      rut: !!profileDataToInsert.rut,
      company: !!profileDataToInsert.company,
      position: !!profileDataToInsert.position,
    });

    // Esperar un momento para que el trigger se ejecute (si está configurado)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Usar upsert para crear o actualizar el perfil
    // onConflict: 'id' significa que si existe un registro con el mismo id, se actualizará
    // ignoreDuplicates: false significa que se actualizarán los campos si el registro ya existe
    const { data: profileData, error: upsertError } = await supabase
      .from('users')
      .upsert(profileDataToInsert, { onConflict: 'id' })
      .select('id, email, full_name, rut, company, position, created_at, updated_at')
      .single();

    if (upsertError) {
      console.error('Error al crear/actualizar perfil en users:', upsertError);
      console.error('Detalles del error:', {
        code: upsertError.code,
        message: upsertError.message,
        details: upsertError.details,
        hint: upsertError.hint,
      });

      // Si falla el upsert, intentar insert directo
      console.log('⚠️ Upsert falló, intentando insert directo como fallback...');
      const { data: insertData, error: insertError } = await supabase
        .from('users')
        .insert(profileDataToInsert)
        .select('id, email, full_name, rut, company, position, created_at, updated_at')
        .single();

      if (insertError) {
        console.error('Error en insert directo:', insertError);
        
        // Si el error es que ya existe, intentar actualizar
        if (insertError.code === '23505') {
          console.log('El perfil ya existe, intentando actualizar...');
          const updateDataPayload = {
            email: data.email.trim(),
            full_name: data.fullName.trim(),
            rut: data.rut.trim(),
            company: data.company.trim(),
            position: data.position.trim(),
          };
          console.log('🔄 Intentando actualizar perfil con datos:', JSON.stringify(updateDataPayload, null, 2));
          
          const { data: updateData, error: updateError } = await supabase
            .from('users')
            .update(updateDataPayload)
            .eq('id', authData.user.id)
            .select('id, email, full_name, rut, company, position, created_at, updated_at')
            .single();

          if (updateError) {
            console.error('Error al actualizar perfil:', updateError);
            return {
              user: null,
              error: new Error(
                `Error al actualizar perfil: ${updateError.message || 'Error desconocido'}`
              ),
            };
          }

          if (!updateData) {
            return {
              user: null,
              error: new Error('No se pudo actualizar el perfil de usuario'),
            };
          }

          console.log('✅ Update exitoso. Datos recibidos:', JSON.stringify(updateData, null, 2));

          // Mapeo explícito desde la estructura de BD (snake_case) al objeto User (camelCase)
          const user: User = {
            id: updateData.id,
            email: updateData.email || '',
            fullName: updateData.full_name || '',
            rut: updateData.rut || '',
            company: updateData.company || '',
            position: updateData.position || '',
            createdAt: updateData.created_at || new Date().toISOString(),
          };

          console.log('👤 Usuario mapeado desde update:', JSON.stringify(user, null, 2));

          return { user, error: null };
        }

        // Si falla la creación del perfil, retornar error descriptivo
        let errorMessage = 'Error al crear el perfil de usuario. ';
        
        if (insertError.code === '42501') {
          errorMessage += 'Error de permisos. Verifica las políticas RLS en Supabase.';
        } else if (insertError.message) {
          errorMessage += insertError.message;
        } else {
          errorMessage += 'Error desconocido.';
        }
        
        return { user: null, error: new Error(errorMessage) };
      }

      // Si el insert directo funcionó
      if (!insertData) {
        return {
          user: null,
          error: new Error('No se pudo crear el perfil de usuario'),
        };
      }

      console.log('✅ Insert directo exitoso. Datos recibidos:', JSON.stringify(insertData, null, 2));

      // Mapeo explícito desde la estructura de BD (snake_case) al objeto User (camelCase)
      const user: User = {
        id: insertData.id,
        email: insertData.email || '',
        fullName: insertData.full_name || '',
        rut: insertData.rut || '',
        company: insertData.company || '',
        position: insertData.position || '',
        createdAt: insertData.created_at || new Date().toISOString(),
      };

      console.log('👤 Usuario mapeado desde insert directo:', JSON.stringify(user, null, 2));

      return { user, error: null };
    }

    if (!profileData) {
      return {
        user: null,
        error: new Error('No se pudo crear el perfil de usuario'),
      };
    }

    // Verificar que los campos se guardaron correctamente
    console.log('✅ Datos recibidos de la BD después del upsert:', JSON.stringify(profileData, null, 2));
    
    if (!profileData.rut || !profileData.company || !profileData.position) {
      console.warn('⚠️ Advertencia: Algunos campos no se guardaron correctamente:', {
        rut: profileData.rut,
        company: profileData.company,
        position: profileData.position,
      });
    } else {
      console.log('✅ Todos los campos se guardaron correctamente');
    }

    // Mapeo explícito desde la estructura de BD (snake_case) al objeto User (camelCase)
    const user: User = {
      id: profileData.id,
      email: profileData.email || '',
      fullName: profileData.full_name || '',
      rut: profileData.rut || '',
      company: profileData.company || '',
      position: profileData.position || '',
      createdAt: profileData.created_at || new Date().toISOString(),
    };

    console.log('👤 Usuario final mapeado:', JSON.stringify(user, null, 2));

    return { user, error: null };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error('Error desconocido al registrar usuario'),
    };
  }
};

/**
 * Inicia sesión con email y contraseña
 */
export const loginUser = async (data: LoginData): Promise<{ user: User | null; error: Error | null }> => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      return { user: null, error: authError };
    }

    if (!authData.user) {
      return { user: null, error: new Error('No se pudo iniciar sesión') };
    }

    // Obtener perfil del usuario
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Error al obtener perfil:', profileError);
      // Si la tabla no existe o el perfil no existe, retornar error descriptivo
      if (profileError.code === 'PGRST116') {
        return { 
          user: null, 
          error: new Error('Perfil de usuario no encontrado. Por favor, regístrate nuevamente o contacta al administrador.') 
        };
      }
      if (profileError.code === '42P01') {
        return { 
          user: null, 
          error: new Error('Error: La tabla "users" no existe. Por favor, ejecuta el SQL de creación de tabla en Supabase.') 
        };
      }
      return { user: null, error: profileError };
    }

    if (!profileData) {
      return { user: null, error: new Error('Perfil de usuario no encontrado') };
    }

    const user: User = {
      id: profileData.id,
      email: profileData.email,
      fullName: profileData.full_name,
      rut: profileData.rut,
      company: profileData.company,
      position: profileData.position,
      createdAt: profileData.created_at,
    };

    return { user, error: null };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error('Error desconocido al iniciar sesión'),
    };
  }
};

/**
 * Cierra sesión
 */
export const logoutUser = async (): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error('Error desconocido al cerrar sesión'),
    };
  }
};

/**
 * Obtiene el usuario actual
 */
export const getCurrentUser = async (): Promise<{ user: User | null; error: Error | null }> => {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return { user: null, error: null };
    }

    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (profileError) {
      console.error('Error al obtener perfil en getCurrentUser:', profileError);
      // Si no hay perfil, retornar null sin error (usuario no autenticado)
      if (profileError.code === 'PGRST116') {
        return { user: null, error: null };
      }
      return { user: null, error: profileError };
    }

    if (!profileData) {
      return { user: null, error: null };
    }

    const user: User = {
      id: profileData.id,
      email: profileData.email,
      fullName: profileData.full_name,
      rut: profileData.rut,
      company: profileData.company,
      position: profileData.position,
      createdAt: profileData.created_at,
    };

    return { user, error: null };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error('Error desconocido al obtener usuario'),
    };
  }
};

