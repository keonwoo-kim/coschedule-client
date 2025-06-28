import { useRouter } from "next/router";
import ItemDetail from "@/components/ItemDetail";

export default function ItemPage() {
  const router = useRouter();
  const id = Number(router.query.id);
  if (!id) return <p>Loading…</p>;

  return <ItemDetail itemId={id} />;
}
