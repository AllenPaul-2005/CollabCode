import { randomInt } from "remirror";

import { useCallback, useMemo } from "react";

import "remirror/styles/all.css";

import * as Y from "yjs";

import { WebsocketProvider } from "y-websocket";

import { InvalidContentHandler } from "remirror";
import {
  BoldExtension,
  ItalicExtension,
  CalloutExtension,
  CodeBlockExtension,
  CodeExtension,
  HistoryExtension,
  LinkExtension,
  UnderlineExtension,
  HeadingExtension,
  OrderedListExtension,
  ListItemExtension,
  BulletListExtension,
  FontSizeExtension,
  CollaborationExtension,
  YjsExtension,
} from "remirror/extensions";

import {
  Remirror,
  useRemirror,
  EditorComponent,
  OnChangeJSON,
  useRemirrorContext,
} from "@remirror/react";

export interface Props {
  username: string;
}

const colors = [
  "#CC444B",
  "#32292F",
  "#8A4FFF",
  "#0B2027",
  "#F21B3F",
  "#FF9914",
  "#1F2041",
  "#4B3F72",
  "#FFC857",
];

const Editor: React.FC<Props> = (props) => {
  const { username } = props;

  // remirror error handler
  const onError: InvalidContentHandler = useCallback(
    ({ json, invalidContent, transformers }: any) => {
      // Automatically remove all invalid nodes and marks.
      return transformers.remove(json, invalidContent);
    },
    []
  );

  const ydoc = useMemo(() => new Y.Doc(), [username]);
  const provider = useMemo(() => {
    const p = new WebsocketProvider(
      "ws://localhost:8000/ws/editor/",
      "my-room",
      ydoc
    );
    p.awareness.setLocalStateField("user", {
      name: username,
      color: colors[randomInt(0, colors.length - 1)],
    });
    return p;
  }, [username, ydoc]);

  const { manager, onChange } = useRemirror({
    extensions: () => [
      new BoldExtension(),
      new ItalicExtension(),
      new UnderlineExtension(),
      new HeadingExtension({ levels: [1, 2, 3] }),
      new FontSizeExtension({ defaultSize: "16", unit: "px" }),
      new OrderedListExtension(),
      new ListItemExtension(),
      new BulletListExtension({ enableSpine: true }),
      new CalloutExtension({ defaultType: "warn" }),
      new CodeBlockExtension(),
      new CodeExtension(),
      new HistoryExtension(),
      new LinkExtension({ autoLink: true }),
      new CollaborationExtension({
        clientID: username,
      }),
      new YjsExtension({
        getProvider: () => provider,
      }),
    ],
    selection: "start",
    onError,
  });

  // Modern toolbar placeholder (replace with real icons as needed)
  const ModernToolbar = () => {
    const { commands } = useRemirrorContext();
    return (
      <div className="flex gap-2 mb-2 p-2 rounded-lg bg-white/60 shadow-sm border border-indigo-100 animate-fade-in">
        <button
          className="p-2 rounded hover:bg-indigo-100 active:scale-95 transition-all"
          title="Bold"
          onClick={() => commands.toggleBold && commands.toggleBold.enabled() && commands.toggleBold()}
          disabled={!commands.toggleBold || !commands.toggleBold.enabled()}
        >
          <b>B</b>
        </button>
        <button
          className="p-2 rounded hover:bg-indigo-100 active:scale-95 transition-all italic"
          title="Italic"
          onClick={() => commands.toggleItalic && commands.toggleItalic.enabled() && commands.toggleItalic()}
          disabled={!commands.toggleItalic || !commands.toggleItalic.enabled()}
        >
          I
        </button>
        <button
          className="p-2 rounded hover:bg-indigo-100 active:scale-95 transition-all underline"
          title="Underline"
          onClick={() => commands.toggleUnderline && commands.toggleUnderline.enabled() && commands.toggleUnderline()}
          disabled={!commands.toggleUnderline || !commands.toggleUnderline.enabled()}
        >
          U
        </button>
        <button
          className="p-2 rounded hover:bg-indigo-100 active:scale-95 transition-all"
          title="Code"
          onClick={() => commands.toggleCode && commands.toggleCode.enabled() && commands.toggleCode()}
          disabled={!commands.toggleCode || !commands.toggleCode.enabled()}
        >
          {'</>'}
        </button>
        {/* Add more buttons/icons as needed */}
      </div>
    );
  };

  return (
    <div className="mt-2 mb-4 animate-fade-in">
      <Remirror
        manager={manager}
        placeholder="Start typing...Please be respectful :)"
        classNames={[
          "p-4 focus:outline-none h-96 overflow-y-auto scrollbar-hide prose lg:prose-xl prose-p:m-0 bg-white/80 rounded-xl shadow-lg border border-indigo-100 backdrop-blur-md transition-all duration-300"
        ]}
        onChange={onChange}
      >
        <ModernToolbar />
        <div className="rounded-md border border-indigo-100">
          <EditorComponent />
        </div>
      </Remirror>
    </div>
  );
};

export default Editor;
