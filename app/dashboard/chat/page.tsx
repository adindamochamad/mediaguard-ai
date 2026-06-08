import { PanelChatAi } from '@/components/panel-chat-ai';
import { BannerModeDemoHybrid } from '@/components/banner-mode-demo-hybrid';

export default function HalamanChat() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Ask MediGuard</h1>
      <p className="mt-1 text-sm text-muted">
        Chat with AI that retrieves live Food and Drug Administration (FDA) and medical sources via Nimble, then answers with
        citations.
      </p>

      <div className="mt-6">
        <BannerModeDemoHybrid konteks="chat" />
      </div>

      <div className="mt-8">
        <PanelChatAi />
      </div>
    </div>
  );
}
