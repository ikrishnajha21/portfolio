import { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export default function HelmetCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rotationRef = useRef({ x: -0.1, y: 0.5 });
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0.5, targetY: -0.1 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Normalize mouse coordinates from -1 to 1 relative to container center
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      
      // Target rotations
      mouseRef.current.targetY = x * 0.8; // yaw
      mouseRef.current.targetX = -y * 0.5 - 0.1; // pitch
    };

    const container = containerRef.current;
    if (container) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let autoRotateAngle = 0;

    // Build procedural helmet vertices and edges
    const generateHelmetGeometry = () => {
      const vertices: Point3D[] = [];
      const edges: [number, number][] = [];
      const visorVertices: Point3D[] = [];

      const latSegments = 18;
      const lonSegments = 24;
      const R = 110;

      // Map to track vertex indices
      const getIndex = (lat: number, lon: number) => lat * (lonSegments + 1) + lon;

      // 1. Generate core spherical/helmet vertices
      for (let lat = 0; lat <= latSegments; lat++) {
        const theta = (lat / latSegments) * Math.PI; // 0 to PI
        
        // Skip very bottom to leave a neck hole
        if (theta > Math.PI * 0.88) continue;

        for (let lon = 0; lon <= lonSegments; lon++) {
          const phi = (lon / lonSegments) * 2 * Math.PI; // 0 to 2PI

          // We'll modify the sphere coordinates to shape it like a motorcycle helmet
          let r = R;

          // Back of the helmet (spoiler protrusion)
          const isBack = phi > Math.PI * 0.7 && phi < Math.PI * 1.3;
          const isTopBack = lat > 3 && lat < 10 && isBack;
          if (isTopBack) {
            r += 12 * Math.sin((phi - Math.PI * 0.7) / 0.6 * Math.PI);
          }

          // Chin bar protrusion (front lower)
          const isFrontLower = lat >= 11 && lat <= 14 && (phi < Math.PI * 0.25 || phi > Math.PI * 1.75);
          if (isFrontLower) {
            const angleDiff = phi > Math.PI ? phi - 2 * Math.PI : phi;
            r += 25 * Math.cos(angleDiff * 1.8);
          }

          // Standard sphere projection
          let x = r * Math.sin(theta) * Math.sin(phi);
          let y = -r * Math.cos(theta); // invert y for canvas coordinates
          let z = r * Math.sin(theta) * Math.cos(phi);

          // Visor cutout area (lat 7 to 10, front angle: -40deg to 40deg)
          const isVisorArea = lat >= 6 && lat <= 10 && (phi < Math.PI * 0.28 || phi > Math.PI * 1.72);
          
          if (isVisorArea) {
            // Flatten or push visor slightly inward to create depth
            const angleDiff = phi > Math.PI ? phi - 2 * Math.PI : phi;
            const factor = Math.cos(angleDiff * 1.5);
            x *= 0.94;
            z *= 0.94;
            y += 2 * factor;
          }

          vertices.push({ x, y, z });
        }
      }

      // 2. Generate regular grid edges, skipping the visor cutout area
      for (let lat = 0; lat < latSegments - 2; lat++) {
        const thetaVal = (lat / latSegments) * Math.PI;
        for (let lon = 0; lon < lonSegments; lon++) {
          const phiVal = (lon / lonSegments) * 2 * Math.PI;
          
          const isThisVisor = lat >= 6 && lat <= 10 && (phiVal < Math.PI * 0.28 || phiVal > Math.PI * 1.72);
          const nextLatVisor = (lat + 1) >= 6 && (lat + 1) <= 10 && (phiVal < Math.PI * 0.28 || phiVal > Math.PI * 1.72);
          
          const idxCurrent = getIndex(lat, lon);
          const idxNextLon = getIndex(lat, lon + 1);
          const idxNextLat = getIndex(lat + 1, lon);

          // Only draw horizontal lines if they aren't fully inside the visor cutout
          if (!isThisVisor) {
            if (idxCurrent < vertices.length && idxNextLon < vertices.length) {
              edges.push([idxCurrent, idxNextLon]);
            }
          }

          // Only draw vertical lines if they don't cross the visor opening
          if (!(isThisVisor && nextLatVisor)) {
            if (idxCurrent < vertices.length && idxNextLat < vertices.length) {
              edges.push([idxCurrent, idxNextLat]);
            }
          }
        }
      }

      // 3. Generate Visor Boundary Points to draw the glass face shield
      // Latitude 6 top border and Latitude 10 bottom border of the visor
      const visorTopLats = [6];
      const visorBottomLats = [10];
      
      const visorBorderPoints: Point3D[] = [];
      // Let's sweep from left edge (-50 deg) to right edge (50 deg)
      const steps = 16;
      for (let i = 0; i <= steps; i++) {
        // Front angles: from -0.28*PI to 0.28*PI
        const angle = -0.28 * Math.PI + (i / steps) * 0.56 * Math.PI;
        const phi = angle < 0 ? angle + 2 * Math.PI : angle;
        
        // Top visor boundary
        let r = R;
        let x = r * Math.sin((6/latSegments)*Math.PI) * Math.sin(phi) * 0.95;
        let y = -r * Math.cos((6/latSegments)*Math.PI);
        let z = r * Math.sin((6/latSegments)*Math.PI) * Math.cos(phi) * 0.95;
        visorBorderPoints.push({ x, y, z });
      }

      for (let i = steps; i >= 0; i--) {
        // Bottom visor boundary
        const angle = -0.28 * Math.PI + (i / steps) * 0.56 * Math.PI;
        const phi = angle < 0 ? angle + 2 * Math.PI : angle;
        
        let r = R;
        // Chin bar push
        const angleDiff = phi > Math.PI ? phi - 2 * Math.PI : phi;
        const offset = 25 * Math.cos(angleDiff * 1.8) * 0.3;

        let x = (r + offset) * Math.sin((10/latSegments)*Math.PI) * Math.sin(phi) * 0.94;
        let y = -(r) * Math.cos((10/latSegments)*Math.PI) + 4;
        let z = (r + offset) * Math.sin((10/latSegments)*Math.PI) * Math.cos(phi) * 0.94;
        visorBorderPoints.push({ x, y, z });
      }

      // 4. Vent Details (Chin vents)
      const chinVentPoints: Point3D[][] = [];
      // Left vent
      chinVentPoints.push([
        { x: -18, y: 55, z: 105 },
        { x: -30, y: 58, z: 98 },
        { x: -28, y: 64, z: 94 },
        { x: -16, y: 62, z: 102 }
      ]);
      // Right vent
      chinVentPoints.push([
        { x: 18, y: 55, z: 105 },
        { x: 30, y: 58, z: 98 },
        { x: 28, y: 64, z: 94 },
        { x: 16, y: 62, z: 102 }
      ]);

      return { vertices, edges, visorBorderPoints, chinVentPoints };
    };

    const geometry = generateHelmetGeometry();

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / (2 * (window.devicePixelRatio || 1));
      const centerY = canvas.height / (2 * (window.devicePixelRatio || 1)) + 15;

      // Update rotation with lerp for smooth motion
      const currentRot = rotationRef.current;
      const nextX = currentRot.x + (mouseRef.current.targetX - currentRot.x) * 0.08;
      let nextY = currentRot.y;

      if (Math.abs(mouseRef.current.targetY - currentRot.y) > 0.001) {
        nextY = currentRot.y + (mouseRef.current.targetY - currentRot.y) * 0.08;
      } else {
        // Subtle idle floating rotation when mouse is still
        autoRotateAngle += 0.003;
        nextY = currentRot.y + Math.sin(autoRotateAngle) * 0.0015;
      }

      rotationRef.current = { x: nextX, y: nextY };

      // Projection calculations using current state
      const cosX = Math.cos(nextX);
      const sinX = Math.sin(nextX);
      const cosY = Math.cos(nextY);
      const sinY = Math.sin(nextY);

      const project = (p: Point3D) => {
        // Rotate Y (yaw)
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.x * sinY + p.z * cosY;

        // Rotate X (pitch)
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = p.y * sinX + z1 * cosX;

        // Simple orthographic projection with subtle perspective factor
        const d = 500; // perspective distance
        const scale = d / (d + z2);

        return {
          x: centerX + x1 * scale,
          y: centerY + y2 * scale,
          z: z2 // keep depth for depth testing or shading
        };
      };

      const projectedVertices = geometry.vertices.map(project);
      const projectedVisor = geometry.visorBorderPoints.map(project);
      const projectedVents = geometry.chinVentPoints.map(vent => vent.map(project));

      // Draw visor shading (semi-transparent filled visor behind the front lines)
      // Visor should look like glossy glass visor in helmet
      ctx.beginPath();
      if (projectedVisor.length > 0) {
        ctx.moveTo(projectedVisor[0].x, projectedVisor[0].y);
        for (let i = 1; i < projectedVisor.length; i++) {
          ctx.lineTo(projectedVisor[i].x, projectedVisor[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(245, 245, 245, 0.03)';
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(245, 245, 245, 0.4)';
        ctx.stroke();
      }

      // Draw wireframe edges
      ctx.strokeStyle = 'rgba(245, 245, 245, 0.15)';
      ctx.lineWidth = 0.8;

      // Draw grid
      geometry.edges.forEach(([p1, p2]) => {
        const pt1 = projectedVertices[p1];
        const pt2 = projectedVertices[p2];

        if (!pt1 || !pt2) return;

        // Check if edge is on the back hemisphere to draw thinner/softer lines
        const isBack = pt1.z > 20 || pt2.z > 20;
        ctx.strokeStyle = isBack ? 'rgba(245, 245, 245, 0.06)' : 'rgba(245, 245, 245, 0.15)';
        ctx.lineWidth = isBack ? 0.6 : 0.85;

        ctx.beginPath();
        ctx.moveTo(pt1.x, pt1.y);
        ctx.lineTo(pt2.x, pt2.y);
        ctx.stroke();
      });

      // Draw thick visor border outline
      ctx.beginPath();
      if (projectedVisor.length > 0) {
        ctx.moveTo(projectedVisor[0].x, projectedVisor[0].y);
        for (let i = 1; i < projectedVisor.length; i++) {
          ctx.lineTo(projectedVisor[i].x, projectedVisor[i].y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(245, 245, 245, 0.65)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Draw chin vents (shaded small triangles/shapes)
      projectedVents.forEach(vent => {
        ctx.beginPath();
        ctx.moveTo(vent[0].x, vent[0].y);
        for (let i = 1; i < vent.length; i++) {
          ctx.lineTo(vent[i].x, vent[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(245, 245, 245, 0.12)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(245, 245, 245, 0.45)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw circular base shadow
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 135, 75, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245, 245, 245, 0.03)';
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full min-h-[380px] md:min-h-[480px] flex items-center justify-center cursor-grab active:cursor-grabbing"
    >
      <canvas 
        ref={canvasRef} 
        className="w-[320px] h-[320px] md:w-[440px] md:h-[440px] max-w-full max-h-full drop-shadow-sm"
      />
    </div>
  );
}
