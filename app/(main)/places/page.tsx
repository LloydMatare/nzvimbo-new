import HeaderTitle from "@/components/header-title";
import PlaceCard from "@/components/main/place-card";
import SearchPlaces from "@/components/main/search-places";

export function meta({}) {
  return [
    { title: "Nzimbo dzose" },
    { name: "description", content: "Welcome to Nzvimbo!" },
  ];
}

function Places() {
  return (
    <div className="md:p-16 lg:p-8 container mx-auto px-4">
      <SearchPlaces />
      <HeaderTitle title="Search Results" />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 ">
        <PlaceCard />
        <PlaceCard />
        <PlaceCard />
        <PlaceCard />
        <PlaceCard />
      </div>
      <HeaderTitle title="Similar Search" />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <PlaceCard />
      </div>
    </div>
  );
}

export default Places;
