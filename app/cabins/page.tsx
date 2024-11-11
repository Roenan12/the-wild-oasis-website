import Counter from "../components/Counter";

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
};

// server component / RSC
export default async function Page(): Promise<JSX.Element> {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await res.json();

  return (
    <div>
      <h1>Cabins page</h1>

      <ul>
        {data.map((user: User) => (
          <li key={user.id}>{user.name} </li>
        ))}
      </ul>
      <Counter users={data} />
    </div>
  );
}
