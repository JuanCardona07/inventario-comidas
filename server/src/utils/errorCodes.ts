export const ErrorCodes = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',

  INGREDIENTE_NOT_FOUND: 'INGREDIENTE_NOT_FOUND',
  INGREDIENTE_CREATE_ERROR: 'INGREDIENTE_CREATE_ERROR',
  INGREDIENTE_UPDATE_ERROR: 'INGREDIENTE_UPDATE_ERROR',
  INGREDIENTE_INSUFFICIENT: 'INGREDIENTE_INSUFFICIENT',

  RECETA_NOT_FOUND: 'RECETA_NOT_FOUND',
  RECETA_CREATE_ERROR: 'RECETA_CREATE_ERROR',

  ORDEN_CREATE_ERROR: 'ORDEN_CREATE_ERROR',
  ORDEN_FETCH_ERROR: 'ORDEN_FETCH_ERROR',

  ALERT_CHECK_ERROR: 'ALERT_CHECK_ERROR',
  ALERT_SEND_ERROR: 'ALERT_SEND_ERROR',
} as const;

export const ErrorMessages = {
  [ErrorCodes.INTERNAL_ERROR]: 'Error interno del servidor',
  [ErrorCodes.VALIDATION_ERROR]: 'Error de validación de datos',
  [ErrorCodes.NOT_FOUND]: 'Recurso no encontrado',

  [ErrorCodes.INGREDIENTE_NOT_FOUND]: 'Ingrediente no encontrado',
  [ErrorCodes.INGREDIENTE_CREATE_ERROR]: 'Error al crear ingrediente',
  [ErrorCodes.INGREDIENTE_UPDATE_ERROR]: 'Error al actualizar ingrediente',
  [ErrorCodes.INGREDIENTE_INSUFFICIENT]: 'No hay suficientes ingredientes',

  [ErrorCodes.RECETA_NOT_FOUND]: 'Receta no encontrada',
  [ErrorCodes.RECETA_CREATE_ERROR]: 'Error al crear receta',

  [ErrorCodes.ORDEN_CREATE_ERROR]: 'Error al procesar orden',
  [ErrorCodes.ORDEN_FETCH_ERROR]: 'Error al obtener órdenes',

  [ErrorCodes.ALERT_CHECK_ERROR]: 'Error al verificar alertas',
  [ErrorCodes.ALERT_SEND_ERROR]: 'Error al enviar alerta',
} as const;
