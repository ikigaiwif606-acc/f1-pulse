import { getDriversList } from "@/lib/data/drivers";
import DriversPageClient from "@/components/drivers/drivers-page-client";

export default async function DriversPage() {
  const drivers = await getDriversList();
  return <DriversPageClient drivers={drivers} />;
}
