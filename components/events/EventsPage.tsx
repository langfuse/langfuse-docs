import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { TextHighlight } from "@/components/ui/text-highlight";
import { EventsCalendar } from "@/components/events/EventsCalendar";
import {
  getLumaEvents,
  LUMA_CALENDAR_URL,
  type LumaEvent,
} from "@/lib/luma-events";

function FallbackCalendar({ calendarUrl }: { calendarUrl: string }) {
  return (
    <div className="flex flex-col items-center gap-4 border border-line-structure bg-surface-bg px-6 py-12 text-center">
      <Text className="max-w-md text-[15px] text-text-tertiary">
        We couldn&apos;t load the live event calendar right now. Browse upcoming
        meetups, workshops, and community hours on Luma.
      </Text>
      <Button href={calendarUrl} target="_blank" rel="noopener noreferrer">
        Open Luma calendar →
      </Button>
    </div>
  );
}

export async function EventsPage() {
  const events = await getLumaEvents();
  const upcoming: LumaEvent[] = events?.upcoming ?? [];
  const past: LumaEvent[] = events?.past ?? [];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 pb-20 pt-10 sm:px-6 md:px-8 md:pt-14">
      <header className="flex flex-col items-center gap-4 text-center">
        <Heading as="h1" size="large" className="text-center">
          <TextHighlight>Events</TextHighlight>
        </Heading>
        <Text className="max-w-xl text-[15px] text-text-tertiary">
          Meetups, workshops, community hours, and conferences with the Langfuse
          community — online and in person around the world.
        </Text>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
          <Button
            href={LUMA_CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Subscribe on Luma →
          </Button>
          <Button href="/community" variant="secondary">
            Join the community
          </Button>
        </div>
      </header>

      {events ? (
        <EventsCalendar upcoming={upcoming} past={past} />
      ) : (
        <FallbackCalendar calendarUrl={LUMA_CALENDAR_URL} />
      )}

      <section className="flex flex-col items-center gap-3 border border-line-structure bg-surface-bg px-6 py-10 text-center">
        <Heading as="h2" size="normal" className="text-[24px] sm:text-[28px]">
          Host a local meetup?
        </Heading>
        <Text className="max-w-md text-[15px] text-text-tertiary">
          Interested in organizing a Langfuse meetup in your city? We can help
          with promotion, swag, and speakers.
        </Text>
        <Button href="/support" variant="secondary" className="mt-1">
          Get in touch →
        </Button>
      </section>
    </div>
  );
}
