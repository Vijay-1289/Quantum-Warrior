
import React, { useState, useCallback, ReactNode } from 'react';

interface Spark {
  id: number;
  x: number;
  y: number;
  angle: number;
  velocity: number;
}

interface ClickSparkProps {
  children: ReactNode;
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
}

const ClickSpark: React.FC<ClickSparkProps> = ({
  children,
  sparkColor = '#fff',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400
}) => {
  const [sparks, setSparks] = useState<Spark[]>([]);

  const createSparks = useCallback((clientX: number, clientY: number) => {
    const newSparks: Spark[] = [];
    const timestamp = Date.now();
    
    for (let i = 0; i < sparkCount; i++) {
      const angle = (360 / sparkCount) * i;
      newSparks.push({
        id: timestamp + i,
        x: clientX,
        y: clientY,
        angle,
        velocity: sparkRadius
      });
    }
    
    setSparks(prevSparks => [...prevSparks, ...newSparks]);
    
    // Remove sparks after animation duration
    setTimeout(() => {
      setSparks(prevSparks => 
        prevSparks.filter(spark => !newSparks.some(newSpark => newSpark.id === spark.id))
      );
    }, duration);
  }, [sparkCount, sparkRadius, duration]);

  const handleClick = useCallback((event: React.MouseEvent) => {
    createSparks(event.clientX, event.clientY);
  }, [createSparks]);

  return (
    <>
      <div onClick={handleClick} className="relative">
        {children}
      </div>
      
      {/* Render sparks */}
      {sparks.map((spark) => {
        const radians = (spark.angle * Math.PI) / 180;
        const translateX = Math.cos(radians) * spark.velocity;
        const translateY = Math.sin(radians) * spark.velocity;
        
        return (
          <div
            key={spark.id}
            className="fixed pointer-events-none z-50"
            style={{
              left: spark.x - sparkSize / 2,
              top: spark.y - sparkSize / 2,
              width: sparkSize,
              height: sparkSize,
              backgroundColor: sparkColor,
              borderRadius: '50%',
              animation: `sparkAnimation-${spark.id} ${duration}ms ease-out forwards`,
              '--translate-x': `${translateX}px`,
              '--translate-y': `${translateY}px`,
              '--spark-radius': `${sparkRadius * 2}px`
            } as React.CSSProperties & { '--translate-x': string; '--translate-y': string; '--spark-radius': string }}
          />
        );
      })}
      
      <style>{`
        ${sparks.map(spark => `
          @keyframes sparkAnimation-${spark.id} {
            0% {
              opacity: 1;
              transform: scale(1) translate(0, 0);
            }
            100% {
              opacity: 0;
              transform: scale(0.3) translate(var(--translate-x), var(--translate-y));
            }
          }
        `).join('')}
      `}</style>
    </>
  );
};

export default ClickSpark;
