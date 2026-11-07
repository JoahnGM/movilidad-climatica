import { AlertTriangle, CheckCircle2, MessageSquareQuote } from 'lucide-react';
import type { ReactNode } from 'react';
import { Banner, Callout, Card, Heading, IconList, Reveal, Text } from '@/components/ds';
import { BANNER_EJEMPLO } from '@/lib/contenido/ejemplo-resultado';
import { getTexto } from '@/lib/contenido/textos';
import type { AnalisisResult, DiagnosticoResult } from '@/lib/types';
import DimensionBar from './DimensionBar';
import EvidenciaPorPregunta from './EvidenciaPorPregunta';
import IcebergVisualization from './IcebergVisualization';
import RecomendacionCard from './RecomendacionCard';
import TarjetaNivel from './TarjetaNivel';
import { TONO_NIVEL } from './tonos';

interface Props {
  resultado: DiagnosticoResult;
  scores?: AnalisisResult | null;
  /** Datos ficticios (`src/lib/contenido/ejemplo-resultado.ts`): banner + badge EJEMPLO. */
  ejemplo?: boolean;
  fecha?: string;
  /** Botones al final (nuevo diagnóstico, copiar, etc.). */
  acciones?: ReactNode;
  /** Prefijo de ids para anclas (dos resultados en la misma página). */
  idBase?: string;
}

/** Texto de alcance oficial sin el marcador de enlace (el enlace se pinta aparte). */
const ALCANCE = getTexto('alcance').cuerpo.replace('[Ver evidencia por pregunta]', '').trim();

/**
 * Resultado completo del diagnóstico. ÚNICA vista de resultado: la usan el demo de la landing
 * (con datos ficticios) y el resultado real del agente. No dupliques esta vista en otro lugar.
 */
export default function ResultadoDiagnostico({ resultado, scores, ejemplo, fecha, acciones, idBase = 'resultado' }: Props) {
  const tono = TONO_NIVEL[resultado.nivel_id];
  return (
    <article aria-label={`Resultado del diagnóstico de ${resultado.municipio}`} className="flex flex-col gap-block">
      {ejemplo && <Banner variant="ejemplo">{BANNER_EJEMPLO}</Banner>}

      <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_1fr]">
        <Reveal className="flex flex-col gap-6">
          <TarjetaNivel resultado={resultado} fecha={fecha} ejemplo={ejemplo} aviso={false} />
          <Card variant="flat">
            <IcebergVisualization
              iceberg_id={resultado.iceberg_id}
              nivel_nombre={resultado.nivel_nombre}
              iceberg_texto_corto={resultado.iceberg_texto_corto}
              capas_activas={resultado.capas_activas}
            />
          </Card>
        </Reveal>
        <Reveal delay={0.08} className="flex flex-col gap-6">
          <Card variant="flat">
            <Text variant="eyebrow">Síntesis</Text>
            <Text variant="body">{resultado.resumen_territorio}</Text>
          </Card>
          <Card variant="flat">
            <Text variant="eyebrow">Fortalezas</Text>
            <IconList items={resultado.fortalezas} icon={CheckCircle2} tone="green" />
          </Card>
          <Card variant="flat">
            <Text variant="eyebrow">Brechas prioritarias</Text>
            <IconList items={resultado.brechas} icon={AlertTriangle} tone="amber" />
          </Card>
        </Reveal>
      </div>

      <Reveal className="flex flex-col gap-6">
        <Heading as="h3" size="h3">Resultado por dimensión</Heading>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resultado.dimensiones_resumen.map((d) => (
            <Card key={d.id} variant="raised" padding="sm">
              <DimensionBar {...d} />
            </Card>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <Callout tone={tono} icon={false}>{resultado.iceberg_texto_ampliado}</Callout>
      </Reveal>

      <Reveal className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Heading as="h3" size="h3">Primeras acciones para tu territorio</Heading>
          <Text variant="small">Ruta sugerida, no lista de obligaciones: el municipio decide por dónde empezar.</Text>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {resultado.recomendaciones.map((r, i) => (
            <RecomendacionCard key={i} {...r} />
          ))}
        </div>
      </Reveal>

      <Reveal>
        <Card variant="sage" padding="lg" className="flex-row gap-4">
          <MessageSquareQuote aria-hidden="true" className="mt-1 size-6 shrink-0 text-green-ink" />
          <Text variant="lead" tone="default">{resultado.mensaje_final}</Text>
        </Card>
      </Reveal>

      {scores?.dimensiones && (
        <Reveal className="flex flex-col gap-6">
          <div id={`${idBase}-evidencia`} className="flex scroll-mt-24 flex-col gap-2">
            <Heading as="h3" size="h3">Evidencia por pregunta</Heading>
            <Text variant="small">Cada puntaje se basa solo en lo que se dijo explícitamente en la conversación. Lo no mencionado puntúa 0.</Text>
          </div>
          <EvidenciaPorPregunta scores={scores} />
        </Reveal>
      )}

      <footer className="flex flex-col gap-5 border-t border-border pt-6">
        <Text variant="small" tone="muted">
          {ALCANCE}
          {scores?.dimensiones && (
            <>
              {' '}
              <a href={`#${idBase}-evidencia`} className="text-green-ink underline underline-offset-2">Ver evidencia por pregunta</a>
            </>
          )}
        </Text>
        {acciones && <div className="flex flex-wrap gap-3">{acciones}</div>}
      </footer>
    </article>
  );
}
