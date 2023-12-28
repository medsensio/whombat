// Purpose: React component for displaying tags on the spectrogram.
import { Popover } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import classNames from "classnames";
import { type HTMLProps, type ReactNode } from "react";
import { useMemo } from "react";

import { type Tag as TagType } from "@/api/schemas";
import { type TagFilter } from "@/api/tags";
import { CloseIcon, TagIcon } from "@/components/icons";
import TagSearchBar from "@/components/tags/TagSearchBar";
import {
  type TagElement,
  type TagGroup,
} from "@/hooks/annotation/useAnnotationTags";
import useStore from "@/store";

function TagBarPopover({
  onClose,
  onAdd,
  onCreate,
  filter,
  ...props
}: {
  onClose?: () => void;
  onAdd?: (tag: TagType) => void;
  onCreate?: (tag: TagType) => void;
  filter?: TagFilter;
} & Omit<HTMLProps<HTMLInputElement>, "value" | "onChange" | "onBlur">) {
  return (
    <TagSearchBar
      // @ts-ignore
      onSelect={(tag) => {
        onAdd?.(tag);
      }}
      onCreate={onCreate}
      autoFocus={true}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onClose?.();
        } else if (e.key === "Enter") {
          onClose?.();
        }
      }}
      initialFilter={filter}
      {...props}
    />
  );
}

export function SpectrogramTag({ tag, onClick }: TagElement) {
  const getTagColor = useStore((state) => state.getTagColor);
  const color = getTagColor(tag);
  const className = useMemo(() => {
    return `bg-${color.color}-500`;
  }, [color]);

  return (
    <span className="flex flex-row gap-1 items-center px-2 rounded-full transition-all group bg-stone-200/0 dark:bg-stone-800/0 hover:bg-stone-200 hover:dark:bg-stone-800">
      <span
        className={`inline-block my-2 w-2 h-2 rounded-full ${className} ring-1 ring-stone-900 opacity-100`}
      ></span>
      <button
        type="button"
        className="hidden flex-row gap-1 items-center opacity-0 transition-all group-hover:flex group-hover:opacity-100 hover:text-red-500 text-stone-800 dark:text-stone-400"
        onClick={onClick}
      >
        <span className="hidden text-xs font-thin whitespace-nowrap opacity-0 transition-all group-hover:inline-block group-hover:opacity-100">
          {tag.key}
        </span>
        <span className="hidden text-sm font-medium whitespace-nowrap opacity-0 transition-all group-hover:inline-block group-hover:opacity-100">
          {tag.value}
        </span>
        <CloseIcon className="inline-block w-3 h-3 stroke-2" />
      </button>
    </span>
  );
}

export function AddTagButton({
  filter,
  onCreate,
  onAdd,
}: {
  filter?: TagFilter;
  onCreate?: (tag: TagType) => void;
  onAdd?: (tag: TagType) => void;
}) {
  return (
    <Popover as="div">
      <Float
        zIndex={999}
        placement="bottom"
        offset={4}
        enter="transition duration-200 ease-out"
        enterFrom="scale-95 opacity-0"
        enterTo="scale-100 opacity-100"
        leave="transition duration-150 ease-in"
        leaveFrom="scale-100 opacity-100"
        leaveTo="scale-95 opacity-0"
        portal={true}
      >
        <Popover.Button className="rounded hover:text-emerald-500 focus:ring-4 focus:outline-none group focus:ring-emerald-500/50">
          +<TagIcon className="inline-block ml-1 w-4 h-4 stroke-2" />
          <span className="hidden absolute ml-1 whitespace-nowrap opacity-0 transition-all duration-200 group-hover:inline-block group-hover:opacity-100">
            Add tag
          </span>
        </Popover.Button>
        <Popover.Panel className="w-52" focus unmount>
          {({ close }) => (
            <TagBarPopover
              filter={filter}
              onClose={close}
              onCreate={(tag) => {
                onCreate?.(tag);
                close();
              }}
              onAdd={(tag) => {
                onAdd?.(tag);
                close();
              }}
            />
          )}
        </Popover.Panel>
      </Float>
    </Popover>
  );
}

export function TagGroup({
  group,
  filter,
  onCreate,
}: {
  group: TagGroup;
  filter?: TagFilter;
  onCreate?: (tag: TagType) => void;
}) {
  const { x, y } = group.position;
  return (
    <div
      className={classNames(
        {
          "pointer-events-none": !group.active,
        },
        "h-5 flex flex-col gap-2 absolute px-2 text-stone-300 ",
      )}
      style={{
        left: x,
        top: y,
      }}
    >
      <div className="relative right-0">
        {group.tags.map((tagElement) => (
          <SpectrogramTag
            key={`${tagElement.tag.key}:${tagElement.tag.value}`}
            {...tagElement}
          />
        ))}
      </div>
      <AddTagButton
        filter={filter}
        onCreate={(tag) => {
          onCreate?.(tag);
          group.onAdd(tag);
        }}
        onAdd={(tag) => {
          group.onAdd(tag);
        }}
      />
    </div>
  );
}

export default function SpectrogramTags({
  tags,
  children,
  filter,
  onCreate,
}: {
  tags: TagGroup[];
  children: ReactNode;
  filter?: TagFilter;
  onCreate?: (tag: TagType) => void;
}) {
  return (
    <div className="overflow-hidden relative w-full h-full rounded">
      {children}
      {tags.map((group) => (
        <TagGroup
          key={group.annotation.uuid}
          group={group}
          filter={filter}
          onCreate={onCreate}
        />
      ))}
    </div>
  );
}
