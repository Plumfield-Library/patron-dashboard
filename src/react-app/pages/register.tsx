import { useAuth } from "@/context/AuthContext.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { FilloutStandardEmbed } from "@fillout/react";

export function Register() {
  const { user, loading } = useAuth();
  if (loading) {
    return <Spinner />;
  }
  if (user == null) {
    return <p>Error: no user specified</p>;
  }
  if (!user.classes) {
    const subject = encodeURIComponent("Library Class Registration");
    return (
      <div className="mx-auto max-w-md p-6 text-center flex items-center justify-center flex-col gap-2">
        <TriangleAlert size={36} />
        <h2 className="text-lg font-semibold">
          Class Registration isn't available right now
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We're not able to offer class registrations for your family at the
          moment. Please get in touch and we'll be glad to help sort things out.
        </p>
        <Button
          render={
            <a
              href={`mailto:plumfieldlivinglibrary@gmail.com?subject=${subject}`}
            >
              Contact the library
            </a>
          }
        />
      </div>
    );
  }

  return (
    <FilloutStandardEmbed
      filloutId={"myD6MvjfNMus"}
      dynamicResize
      parameters={{
        email: user.email,
        name: user.name,
      }}
    />
  );
}
