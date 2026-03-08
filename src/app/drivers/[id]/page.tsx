// app/drivers/[id]/page.tsx
import DriverProfile from './DriverProfile';
import { fetchDriverProfile } from './model/api';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    const driverData = await fetchDriverProfile(id);

    return <DriverProfile driverData={driverData} />;
}