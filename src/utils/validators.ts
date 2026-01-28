/**
 * Utilidades de validación para KarinPulse
 */

/**
 * Valida y formatea RUT chileno
 * @param rut - RUT sin puntos ni guión (ej: "123456789") o con formato (ej: "12.345.678-9")
 * @returns Objeto con isValid, formatted y clean
 */
export const validateRUT = (rut: string): {
  isValid: boolean;
  formatted: string;
  clean: string;
} => {
  // Limpiar el RUT: remover puntos, espacios y guiones
  const clean = rut.replace(/[.\s-]/g, '').toUpperCase();

  // Validar que tenga al menos 8 caracteres (7 dígitos + 1 dígito verificador)
  if (clean.length < 8 || clean.length > 9) {
    return {
      isValid: false,
      formatted: rut,
      clean,
    };
  }

  // Separar número y dígito verificador
  const rutNumber = clean.slice(0, -1);
  const dv = clean.slice(-1);

  // Validar que el número sea solo dígitos
  if (!/^\d+$/.test(rutNumber)) {
    return {
      isValid: false,
      formatted: rut,
      clean,
    };
  }

  // Validar dígito verificador
  let sum = 0;
  let multiplier = 2;

  // Calcular desde el final
  for (let i = rutNumber.length - 1; i >= 0; i--) {
    sum += parseInt(rutNumber[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = sum % 11;
  const calculatedDV = remainder < 2 ? remainder.toString() : (11 - remainder).toString();

  // Si el resto es 11, el dígito verificador es 0
  // Si el resto es 10, el dígito verificador es K
  const expectedDV = remainder === 0 ? '0' : remainder === 1 ? 'K' : calculatedDV;

  const isValid = dv === expectedDV;

  // Formatear RUT con puntos y guión
  const formatted = isValid
    ? `${rutNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`
    : rut;

  return {
    isValid,
    formatted,
    clean,
  };
};

/**
 * Formatea RUT sin validar
 */
export const formatRUT = (rut: string): string => {
  const clean = rut.replace(/[.\s-]/g, '').toUpperCase();
  if (clean.length < 8) return rut;

  const rutNumber = clean.slice(0, -1);
  const dv = clean.slice(-1);
  return `${rutNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`;
};

/**
 * Valida formato de email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida fortaleza de contraseña
 * Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una mayúscula');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una minúscula');
  }
  if (!/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};


