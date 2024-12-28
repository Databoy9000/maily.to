import { Braces, ChevronUp, CornerDownLeft, Eye } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { useRef, useState } from 'react';
import { cn } from '../utils/classname';
import { useEffect } from 'react';
import { InputAutocomplete } from './ui/input-autocomplete';
import { DEFAULT_RENDER_VARIABLE_FUNCTION, useMailyContext } from '../provider';
import { useMemo } from 'react';
import { ForExtension } from '../nodes/for/for';
import { memo } from 'react';
import { getClosestNodeByName } from '../utils/columns';
import { Editor } from '@tiptap/core';
import { processVariables } from '../utils/variable';

type ShowPopoverProps = {
  showIfKey?: string;
  onShowIfKeyValueChange?: (when: string) => void;

  editor: Editor;
};

function _ShowPopover(props: ShowPopoverProps) {
  const { showIfKey = '', onShowIfKeyValueChange, editor } = props;

  const { variables = [], renderVariable = DEFAULT_RENDER_VARIABLE_FUNCTION } =
    useMailyContext();
  const [isUpdatingKey, setIsUpdatingKey] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const autoCompleteOptions = useMemo(() => {
    return processVariables(variables, {
      query: showIfKey || '',
      from: 'bubble-variable',
      editor,
    }).map((variable) => variable.name);
  }, [variables, showIfKey, editor]);

  const isValidWhenKey = showIfKey || autoCompleteOptions.includes(showIfKey);

  return (
    <Popover
      onOpenChange={(open) => {
        if (open) {
          return;
        }

        setIsUpdatingKey(false);
      }}
    >
      <PopoverTrigger
        className={cn(
          'mly-flex mly-items-center mly-gap-1 mly-rounded-md mly-px-1.5 mly-text-sm data-[state=open]:mly-bg-soft-gray hover:mly-bg-soft-gray focus-visible:mly-relative focus-visible:mly-z-10 focus-visible:mly-outline-none focus-visible:mly-ring-2 focus-visible:mly-ring-gray-400 focus-visible:mly-ring-offset-2',
          showIfKey &&
            'mly-bg-rose-100 mly-text-rose-800 data-[state=open]:mly-bg-rose-100 hover:mly-bg-rose-100'
        )}
      >
        <Eye className="mly-h-4 mly-w-4 mly-stroke-[2.5]" />
      </PopoverTrigger>
      <PopoverContent
        className="mly-flex mly-w-max mly-rounded-lg !mly-p-0.5"
        side="top"
        sideOffset={8}
        align="end"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <span className="mly-flex mly-items-center mly-px-1.5 mly-text-sm mly-leading-none">
          Show if
        </span>
        {!isUpdatingKey && (
          <button
            onClick={() => {
              setIsUpdatingKey(true);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }}
          >
            {renderVariable({
              variable: {
                name: showIfKey,
                isValidKey: !!isValidWhenKey,
              },
              fallback: '',
              from: 'bubble-variable',
              editor,
            })}
          </button>
        )}
        {isUpdatingKey && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsUpdatingKey(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsUpdatingKey(false);
              }
            }}
          >
            <InputAutocomplete
              value={showIfKey || ''}
              onValueChange={(value) => {
                onShowIfKeyValueChange?.(value);
              }}
              onOutsideClick={() => {
                setIsUpdatingKey(false);
              }}
              onSelectOption={(value) => {
                onShowIfKeyValueChange?.(value);
                setIsUpdatingKey(false);
              }}
              autoCompleteOptions={autoCompleteOptions}
              ref={inputRef}
            />
          </form>
        )}
      </PopoverContent>
    </Popover>
  );
}

export const ShowPopover = memo(_ShowPopover);
