import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { firmarAcceso, huellaCodigo, parsearCodigos, verificarAcceso } from '@/lib/seguridad/acceso'
import { _reiniciarParaPruebas, consumir } from '@/lib/seguridad/rate-limit'

const env = { ...process.env }
beforeEach(() => {
  process.env.ACCESS_JWT_SECRET = 'x'.repeat(40)
  process.env.ACCESS_CODES = 'PILOTO-ABC123:Municipio A, PILOTO-XYZ789 ,corto'
})
afterEach(() => { process.env = { ...env } })

describe('códigos de acceso', () => {
  it('parsea códigos con etiqueta opcional e ignora códigos de menos de 6 caracteres', () => {
    expect(parsearCodigos()).toEqual([
      { codigo: 'PILOTO-ABC123', etiqueta: 'Municipio A' },
      { codigo: 'PILOTO-XYZ789' },
    ])
  })

  it('firma y verifica; el JWT no contiene el código ni la etiqueta', async () => {
    const huella = await huellaCodigo('PILOTO-ABC123')
    const token = await firmarAcceso(huella)
    expect(token).toBeTruthy()
    const payload = JSON.parse(Buffer.from(token!.split('.')[1], 'base64url').toString())
    expect(JSON.stringify(payload)).not.toMatch(/PILOTO|Municipio/)
    expect(await verificarAcceso(token!)).toBe(huella)
  })

  it('revoca al quitar el código de ACCESS_CODES', async () => {
    const token = await firmarAcceso(await huellaCodigo('PILOTO-ABC123'))
    process.env.ACCESS_CODES = 'PILOTO-XYZ789'
    expect(await verificarAcceso(token!)).toBeNull()
  })

  it('rechaza tokens manipulados, ausentes o sin secreto', async () => {
    const token = await firmarAcceso(await huellaCodigo('PILOTO-ABC123'))
    expect(await verificarAcceso(token!.slice(0, -2) + 'xx')).toBeNull()
    expect(await verificarAcceso(undefined)).toBeNull()
    process.env.ACCESS_JWT_SECRET = 'corto'
    expect(await firmarAcceso('h')).toBeNull()
    expect(await verificarAcceso(token!)).toBeNull()
  })
})

describe('rate limit en memoria', () => {
  it('permite hasta max por ventana y luego bloquea; reinicia al vencer la ventana', () => {
    _reiniciarParaPruebas()
    const cfg = { max: 3, ventanaMs: 1_000 }
    expect([1, 2, 3, 4].map(() => consumir('k', cfg, 0))).toEqual([true, true, true, false])
    expect(consumir('k', cfg, 1_001)).toBe(true)
    expect(consumir('otra', cfg, 0)).toBe(true)
  })
})
