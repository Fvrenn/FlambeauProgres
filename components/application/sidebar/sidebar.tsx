"use client";

import {
  Accordion,
  AccordionItem,
  type ListboxProps,
  type ListboxSectionProps,
  type Selection,
} from "@heroui/react";
import React from "react";
import { Listbox, Tooltip, ListboxItem, ListboxSection } from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";
import "./sidebar.css";

export enum SidebarItemType {
  Nest = "nest",
}

export type SidebarItem = {
  key: string;
  title: string;
  icon?: string;
  href?: string;
  type?: SidebarItemType.Nest;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  items?: SidebarItem[];
  className?: string;
};

export type SidebarProps = Omit<ListboxProps<SidebarItem>, "children"> & {
  items: SidebarItem[];
  isCompact?: boolean;
  hideEndContent?: boolean;
  iconClassName?: string;
  sectionClasses?: ListboxSectionProps["classNames"];
  classNames?: ListboxProps["classNames"];
  defaultSelectedKey: string;
  onSelect?: (key: string) => void;
};

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      items,
      isCompact,
      defaultSelectedKey,
      onSelect,
      hideEndContent,
      sectionClasses: sectionClassesProp = {},
      itemClasses: itemClassesProp = {},
      iconClassName,
      classNames,
      className,
      ...props
    },
    ref
  ) => {
    const [selected, setSelected] =
      React.useState<React.Key>(defaultSelectedKey);

    const sectionClasses = {
      ...sectionClassesProp,
      base: cn(sectionClassesProp?.base, "w-full", {
        "p-0 max-w-[44px]": isCompact,
      }),
      group: cn(sectionClassesProp?.group, {
        "flex flex-col gap-1": isCompact,
      }),
      heading: cn(sectionClassesProp?.heading, {
        hidden: isCompact,
      }),
    };

    const itemClasses = {
      ...itemClassesProp,
      base: cn(itemClassesProp?.base, {
        "w-11 h-11 gap-0 p-0": isCompact,
      }),
    };

    const renderNestItem = React.useCallback(
      (item: SidebarItem) => {
        const isNestType =
          item.items &&
          item.items?.length > 0 &&
          item?.type === SidebarItemType.Nest;

        if (isNestType) {
          // Is a nest type item , so we need to remove the href
          delete item.href;
        }

        return (
          <ListboxItem
            {...item}
            key={item.key}
            classNames={{
              base: cn(
                {
                  "h-auto p-0": !isCompact && isNestType,
                },
                {
                  "inline-block w-11": isCompact && isNestType,
                }
              ),
            }}
            endContent={
              isCompact || isNestType || hideEndContent
                ? null
                : (item.endContent ?? null)
            }
            startContent={
              isCompact || isNestType ? null : item.icon ? (
                <Icon
                  className={cn(
                    "text-default-500 group-data-[selected=true]:text-foreground",
                    iconClassName
                  )}
                  icon={item.icon}
                  width={24}
                />
              ) : (
                (item.startContent ?? null)
              )
            }
            title={isCompact || isNestType ? null : item.title}
          >
            {/* DEBUT DE LA CORRECTION : 
    Fusionner les deux blocs en une seule expression ternaire.
  */}
            {isCompact ? (
              <Tooltip content={item.title} placement="right">
                <div className="flex w-full items-center justify-center">
                  {item.icon ? (
                    <Icon
                      className={cn(
                        "text-default-500 group-data-[selected=true]:text-foreground",
                        iconClassName
                      )}
                      icon={item.icon}
                      width={24}
                    />
                  ) : (
                    (item.startContent ?? null)
                  )}
                </div>
              </Tooltip>
            ) : isNestType ? (
              <Accordion className={"p-0 "}>
                <AccordionItem
                  key={item.key}
                  aria-label={item.title}
                  classNames={{
                    heading: "pr-3",
                    trigger: "p-0",
                    content: "py-0 px-4",
                  }}
                  title={
                    item.icon ? (
                      <div
                        className={
                          "flex h-11 cursor-pointer items-center gap-2 px-2 py-1.5"
                        }
                      >
                        <Icon
                          className={cn(
                            "text-default-500 group-data-[selected=true]:text-foreground",
                            iconClassName
                          )}
                          icon={item.icon}
                          width={24}
                        />
                        <span className="text-small font-medium text-default-500 group-data-[selected=true]:text-foreground">
                          {item.title}
                        </span>
                      </div>
                    ) : (
                      (item.startContent ?? null)
                    )
                  }
                >
                  {item.items && item.items?.length > 0 ? (
                    <Listbox
                      className={"mt-0.5"}
                      classNames={{
                        list: cn("border-l border-[#c0c0b8] pl-4 test"),
                      }}
                      itemClasses={{
                        base: "flex justify-between data-[hover=true]:bg-black data-[hover=true]:text-white py-3 rounded-full px-4 font-medium",
                      }}
                      items={item.items}
                      variant="flat"
                    >
                      {item.items.map(renderNestListItem)}
                    </Listbox>
                  ) : (
                    renderItem(item)
                  )}
                </AccordionItem>
              </Accordion>
            ) : null}
            {/* FIN DE LA CORRECTION */}
          </ListboxItem>
        );
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [isCompact, hideEndContent, iconClassName, items]
    );

    const renderNestListItem = React.useCallback((item: SidebarItem) => {
      return (
        <ListboxItem
          {...item}
          key={item.key}
          endContent={
            <Icon
              className="icon transition-opacity"
              icon="solar:alt-arrow-right-linear"
              width={16}
            />
          }
          textValue={item.title}
        >
          {item.title}
        </ListboxItem>
      );
    }, []);

    const renderItem = React.useCallback(
      (item: SidebarItem) => {
        const isNestType =
          item.items &&
          item.items?.length > 0 &&
          item?.type === SidebarItemType.Nest;

        if (isNestType) {
          return renderNestItem(item);
        }

        return (
          <ListboxItem
            {...item}
            key={item.key}
            endContent={
              isCompact || hideEndContent ? null : (item.endContent ?? null)
            }
            startContent={
              isCompact ? null : item.icon ? (
                <Icon
                  className={cn(
                    "text-default-500 group-data-[selected=true]:text-foreground",
                    iconClassName
                  )}
                  icon={item.icon}
                  width={24}
                />
              ) : (
                (item.startContent ?? null)
              )
            }
            textValue={item.title}
            title={isCompact ? null : item.title}
          >
            {isCompact ? (
              <Tooltip content={item.title} placement="right">
                <div className="flex w-full items-center justify-center">
                  {item.icon ? (
                    <Icon
                      className={cn(
                        "text-default-500 group-data-[selected=true]:text-foreground",
                        iconClassName
                      )}
                      icon={item.icon}
                      width={24}
                    />
                  ) : (
                    (item.startContent ?? null)
                  )}
                </div>
              </Tooltip>
            ) : null}
          </ListboxItem>
        );
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [isCompact, hideEndContent, iconClassName, itemClasses?.base]
    );

    return (
      <Listbox
        key={isCompact ? "compact" : "default"}
        ref={ref}
        hideSelectedIcon
        as="nav"
        className={cn("list-none", className)}
        classNames={{
          ...classNames,
          list: cn("items-center", classNames?.list),
        }}
        color="default"
        itemClasses={{
          ...itemClasses,
          base: cn(
            "px-3 min-h-11 rounded-large h-[44px] data-[selected=true]:bg-default-100 data-[focus=true]:!bg-transparent data-[selected=true]:data-[focus=true]:!bg-default-100",
            itemClasses?.base
          ),
          title: cn(
            "text-small font-medium text-default-500 group-data-[selected=true]:text-foreground",
            itemClasses?.title
          ),
        }}
        items={items}
        selectedKeys={[selected] as unknown as Selection}
        selectionMode="single"
        variant="flat"
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0];

          setSelected(key as React.Key);
          onSelect?.(key as string);
        }}
        {...props}
      >
        {(item) => {
          return item.items &&
            item.items?.length > 0 &&
            item?.type === SidebarItemType.Nest ? (
            renderNestItem(item)
          ) : item.items && item.items?.length > 0 ? (
            <ListboxSection
              key={item.key}
              classNames={sectionClasses}
              showDivider={isCompact}
              title={item.title}
            >
              {item.items.map(renderItem)}
            </ListboxSection>
          ) : (
            renderItem(item)
          );
        }}
      </Listbox>
    );
  }
);

Sidebar.displayName = "Sidebar";

export default Sidebar;
