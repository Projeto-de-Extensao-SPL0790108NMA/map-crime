import { useNavigate } from '@tanstack/react-router';
import { CheckIcon, CopyCheckIcon, CopyIcon } from 'lucide-react';

import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

interface TrackingCodeModalProps {
  trackingCode?: string | null;
}

export function TrackingCodeModal({ trackingCode }: TrackingCodeModalProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const navigate = useNavigate();

  return (
    <Dialog
      open={trackingCode != null}
      onOpenChange={() => navigate({ to: '/' })}
    >
      <DialogContent
        className="flex flex-col items-center gap-4 text-center slide-in-from-right-50 slide-out-to-right-50 w-xs"
        asChild={false}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <CheckIcon
          className="bg-green-500/80 rounded-full text-white"
          size={60}
        />
        <DialogTitle className="text-primary">Denúncia Enviada!</DialogTitle>
        <DialogDescription>
          Sua denúncia foi enviada com sucesso. Agradecemos por nos ajudar a
          manter a comunidade segura.
        </DialogDescription>

        <div className="w-full">
          <Label className="text-headings mb-2">Código de rastreamento:</Label>
          <InputGroup>
            <InputGroupInput value={trackingCode ?? ''} readOnly />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                aria-label="Copy"
                title="Copy"
                size="icon-xs"
                onClick={() => trackingCode && copyToClipboard(trackingCode)}
              >
                {isCopied ? (
                  <CopyCheckIcon className="animate-accordion-down" />
                ) : (
                  <CopyIcon />
                )}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
}
