"use client";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3, Group } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "./globe.json";

declare module "@react-three/fiber" {
    interface ThreeElements {
        threeGlobe: ThreeElements["mesh"] & {
            new (): ThreeGlobe;
        };
    }
}

extend({ ThreeGlobe: ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

type Position = {
    order: number;
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    arcAlt: number;
    color: string;
};

export type GlobeConfig = {
    pointSize?: number;
    globeColor?: string;
    showAtmosphere?: boolean;
    atmosphereColor?: string;
    atmosphereAltitude?: number;
    emissive?: string;
    emissiveIntensity?: number;
    shininess?: number;
    polygonColor?: string;
    ambientLight?: string;
    directionalLeftLight?: string;
    directionalTopLight?: string;
    pointLight?: string;
    arcTime?: number;
    arcLength?: number;
    rings?: number;
    maxRings?: number;
    initialPosition?: {
        lat: number;
        lng: number;
    };
    autoRotate?: boolean;
    autoRotateSpeed?: number;
};

interface WorldProps {
    globeConfig: GlobeConfig;
    data: Position[];
}

function hexToRgb(hex: string) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

function genRandomNumbers(min: number, max: number, count: number) {
    const arr = [];
    while (arr.length < count) {
        const r = Math.floor(Math.random() * (max - min)) + min;
        if (arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
}

const Globe = ({ globeConfig, data }: WorldProps) => {
    const globeRef = useRef<ThreeGlobe | null>(null);
    const groupRef = useRef<Group>(null);
    const animationRef = useRef<number>();
    const lastUpdateRef = useRef<number>(0);
    const ringsIntervalRef = useRef<number>(2000);
    const isInitializedRef = useRef(false);

    const defaultProps = useMemo(() => ({
        pointSize: 1,
        atmosphereColor: "#ffffff",
        showAtmosphere: true,
        atmosphereAltitude: 0.1,
        polygonColor: "rgba(255,255,255,0.7)",
        globeColor: "#1d072e",
        emissive: "#000000",
        emissiveIntensity: 0.1,
        shininess: 0.9,
        arcTime: 2000,
        arcLength: 0.9,
        rings: 1,
        maxRings: 3,
        ...globeConfig,
    }), [globeConfig]);

    const filteredPoints = useMemo(() => {
        if (!data) return [];

        return data.flatMap(arc => [
            {
                size: defaultProps.pointSize,
                order: arc.order,
                color: arc.color,
                lat: arc.startLat,
                lng: arc.startLng
            },
            {
                size: defaultProps.pointSize,
                order: arc.order,
                color: arc.color,
                lat: arc.endLat,
                lng: arc.endLng
            }
        ]).filter((v, i, a) =>
            a.findIndex(v2 => v2.lat === v.lat && v2.lng === v.lng) === i
        );
    }, [data, defaultProps.pointSize]);

    const initGlobe = useCallback(() => {
        if (!groupRef.current || globeRef.current || !data) return;

        const globe = new ThreeGlobe();
        globeRef.current = globe;
        groupRef.current.add(globe);

        globe.hexPolygonsData(countries.features)
            .hexPolygonResolution(3)
            .hexPolygonMargin(0.7)
            .showAtmosphere(defaultProps.showAtmosphere)
            .atmosphereColor(defaultProps.atmosphereColor)
            .atmosphereAltitude(defaultProps.atmosphereAltitude)
            .hexPolygonColor(() => defaultProps.polygonColor);

        globe.arcsData(data)
            .arcStartLat((d) => (d as { startLat: number }).startLat)
            .arcStartLng((d) => (d as { startLng: number }).startLng)
            .arcEndLat((d) => (d as { endLat: number }).endLat)
            .arcEndLng((d) => (d as { endLng: number }).endLng)
            .arcColor((e: unknown) => (e as { color: string }).color)
            .arcAltitude((e) => (e as { arcAlt: number }).arcAlt)
            .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
            .arcDashLength(defaultProps.arcLength)
            .arcDashInitialGap((e) => (e as { order: number }).order)
            .arcDashGap(15)
            .arcDashAnimateTime(() => defaultProps.arcTime);

        globe.pointsData(filteredPoints)
            .pointColor((e) => (e as { color: string }).color)
            .pointsMerge(true)
            .pointAltitude(0.0)
            .pointRadius(2);

        globe.ringsData([])
            .ringColor(() => defaultProps.polygonColor)
            .ringMaxRadius(defaultProps.maxRings)
            .ringPropagationSpeed(RING_PROPAGATION_SPEED)
            .ringRepeatPeriod(
                (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings
            );

        const globeMaterial = globe.globeMaterial() as unknown as {
            color: Color;
            emissive: Color;
            emissiveIntensity: number;
            shininess: number;
        };
        globeMaterial.color = new Color(defaultProps.globeColor);
        globeMaterial.emissive = new Color(defaultProps.emissive);
        globeMaterial.emissiveIntensity = defaultProps.emissiveIntensity;
        globeMaterial.shininess = defaultProps.shininess;

        isInitializedRef.current = true;
    }, [data, defaultProps, filteredPoints]);

    const updateRings = useCallback((time: number) => {
        if (!globeRef.current || !data) return;

        if (time - lastUpdateRef.current >= ringsIntervalRef.current) {
            lastUpdateRef.current = time;

            const newNumbersOfRings = genRandomNumbers(
                0,
                data.length,
                Math.floor((data.length * 4) / 5)
            );

            const ringsData = data
                .filter((_, i) => newNumbersOfRings.includes(i))
                .map((d) => ({
                    lat: d.startLat,
                    lng: d.startLng,
                    color: d.color,
                }));

            globeRef.current.ringsData(ringsData);
        }
    }, [data]);

    const animationLoop = useCallback((time: number) => {
        updateRings(time);
        animationRef.current = requestAnimationFrame(animationLoop);
    }, [updateRings]);

    useEffect(() => {
        initGlobe();
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (globeRef.current && groupRef.current) {
                groupRef.current.remove(globeRef.current);
                globeRef.current = null;
            }
        };
    }, [initGlobe]);

    useEffect(() => {
        if (isInitializedRef.current) {
            animationRef.current = requestAnimationFrame(animationLoop);
            return () => {
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }
            };
        }
    }, [animationLoop]);

    return <group ref={groupRef} />;
};

const WebGLRendererConfig = () => {
    const { gl, size } = useThree();

    useEffect(() => {
        gl.setPixelRatio(window.devicePixelRatio);
        gl.setSize(size.width, size.height);
        gl.setClearColor(0xffaaff, 0);
    }, [gl, size]);

    return null;
};

const World = ({ globeConfig, data }: WorldProps) => {
    const scene = useMemo(() => {
        const scene = new Scene();
        scene.fog = new Fog(0xffffff, 400, 2000);
        return scene;
    }, []);

    const camera = useMemo(() =>
            new PerspectiveCamera(50, aspect, 180, 1800),
        []);

    return (
        <Canvas scene={scene} camera={camera}>
            <WebGLRendererConfig />
            <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
            <directionalLight
                color={globeConfig.directionalLeftLight}
                position={new Vector3(-400, 100, 400)}
            />
            <directionalLight
                color={globeConfig.directionalTopLight}
                position={new Vector3(-200, 500, 200)}
            />
            <pointLight
                color={globeConfig.pointLight}
                position={new Vector3(-200, 500, 200)}
                intensity={0.8}
            />
            <Globe globeConfig={globeConfig} data={data} />
            <OrbitControls
                enablePan={false}
                enableZoom={false}
                minDistance={cameraZ}
                maxDistance={cameraZ}
                autoRotateSpeed={1}
                autoRotate={true}
                minPolarAngle={Math.PI / 3.5}
                maxPolarAngle={Math.PI - Math.PI / 3}
            />
        </Canvas>
    );
};

export { World };