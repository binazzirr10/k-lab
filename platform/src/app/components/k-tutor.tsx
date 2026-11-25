import { resolveTutorContext, type TutorContextId } from "@/lib/tutor-contexts";
import { KTutorChat } from "./k-tutor-chat";

/** The contexts stay on the server: they carry the tutor's instructions and every scene's text. */
export function KTutor({ context }: { context: TutorContextId }) {
  return <KTutorChat context={context} label={resolveTutorContext(context)?.label ?? "K‑LAB"} />;
}
