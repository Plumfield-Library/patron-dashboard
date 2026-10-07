import { FilloutStandardEmbed } from "@fillout/react";
import { useAuth } from "@/context/AuthContext.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Button } from "@/components/ui/button.tsx";
import { TriangleAlert } from "lucide-react";

export function Appointments() {
  const { data: user, isPending: loading, error } = useAuth();

  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  if (!user.visit) {
    const subject = encodeURIComponent("Library visit scheduling");
    const body = encodeURIComponent(
      `Hi Plumfield team,\n\nI noticed visit scheduling isn't available on my account (${user.name ?? ""}). Could we connect about it?\n\nThanks!`,
    );

    return (
      <div className="mx-auto max-w-md p-6 text-center flex items-center justify-center flex-col gap-2">
        <TriangleAlert size={36} />
        <h2 className="text-lg font-semibold">
          Visit scheduling isn't available right now
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We're not able to offer new visit bookings for your family at the
          moment. Please get in touch and we'll be glad to help sort things out.
        </p>
        <Button
          render={
            <a
              href={`mailto:plumfieldlivinglibrary@gmail.com?subject=${subject}&body=${body}`}
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
      filloutId={"3Sc1rLhCbRus"}
      dynamicResize
      parameters={{
        email: user?.email,
        name: user?.name,
      }}
    />
  );
}
