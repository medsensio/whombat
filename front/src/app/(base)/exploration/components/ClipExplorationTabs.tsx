import {
  useRouter,
  useSearchParams,
  useSelectedLayoutSegment,
} from "next/navigation";

import * as icons from "@/lib/components/icons";
import SectionTabs from "@/lib/components/navigation/SectionTabs";
import Tab from "@/lib/components/ui/Tab";

export default function ExplorationTabs() {
  const router = useRouter();
  const params = useSearchParams();
  const selectedLayoutSegment = useSelectedLayoutSegment();

  return (
    <SectionTabs
      tabs={[
        <Tab
          key={"gallery"}
          active={selectedLayoutSegment === "gallery"}
          onClick={() => {
            router.push(`/exploration/clips/gallery/?${params.toString()}`);
          }}
        >
          )
          <icons.GalleryIcon className="w-5 h-5 align-middle" />
          Gallery
        </Tab>,
        <Tab
          key={"list"}
          active={selectedLayoutSegment === "list"}
          onClick={() => {
            router.push(`/exploration/clips/list/?${params.toString()}`);
          }}
        >
          <icons.ListIcon className="w-5 h-5 align-middle" />
          List
        </Tab>,
      ]}
    />
  );
}