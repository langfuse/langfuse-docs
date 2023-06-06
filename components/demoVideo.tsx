import { Stream } from "@cloudflare/stream-react";
import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XSquareIcon } from "lucide-react";
import { Card } from "nextra-theme-docs";
import { Clapperboard } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { AiOutlineCloud } from "react-icons/ai";

 function VideoPlayer() {
  const cloudflareVideoId = "dd8e215b11a494d2ce4409e4a95b52df";

  return (
    <div className="mt-3 mb-6 overflow-hidden rounded-xl shadow-lg aspect-[1.55] ring-1 ring-slate-700 bg-slate-50 bg-cover bg-[url('/demo_thumbnail.jpg')]">
      <Stream
        controls
        src={cloudflareVideoId}
        poster="https://langfuse.com/demo_thumbnail.jpg"
      />
    </div>
  );
}

export default function Buttons() {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <>
      <div onClick={() => setOpen(true)}>
        <Card
          icon={<Clapperboard size="24" />}
          title="Demo (3:33 min)"
          children={null}
          href="#"
        />
      </div>
      <Card icon={<span>🚀</span>} title="Quickstart" href="/docs/get-started" children={null}/>
      <Card
        icon={<SiGithub size="24" />}
        title="Repo"
        href="https://github.com/langfuse/langfuse"
        children={null}
      />
      <Card
        icon={<AiOutlineCloud size="24" />}
        title="Sign in"
        href="https://cloud.langfuse.com"
        children={null}
      />
      <DemoVideo open={open} setOpen={setOpen} />
  </>
  )
}


interface DemoVideoProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function DemoVideo(props: DemoVideoProps) {

  return (
    <>
      <Transition.Root show={props.open} as={Fragment}>
        <Dialog as="div" className="relative z-10 w-screen" onClose={props.setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden px-4 pb-4 pt-5 transition-all sm:my-8 sm:w-full md:w-2/3 mx-auto sm:p-6">
                  <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md text-black"
                      onClick={() => props.setOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XSquareIcon className="h-6 w-6 bg-transparent" aria-hidden="true" />
                    </button>
                  </div>
                    <div className="text-center sm:ml-4 sm:mt-0 sm:text-left pt-5">
                      <div className="mt-2">
                        <VideoPlayer />
                      </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}