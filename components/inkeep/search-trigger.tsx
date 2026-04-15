'use client';

import { type ComponentProps } from 'react';
import { useAISearchContext } from './search-context';
import { Button } from '@/components/ui/button';

export function AISearchTrigger({
  position = 'default',
  className,
  ...props
}: ComponentProps<'button'> & { position?: 'default' | 'float' }) {
  const { open, setOpen } = useAISearchContext();

  return (
    <Button
      data-state={open ? 'open' : 'closed'}
      shortcutKey="a"
      showShortcutonMobile={true}
      size="small"
      className="max-w-[75px]"
      onClick={() => setOpen(!open)}
      {...props}
    >
      {props.children}
    </Button>
  );
}
