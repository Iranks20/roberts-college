import { useState } from 'react'
import { Smartphone, CreditCard, Landmark, Loader2, CheckCircle2, ShieldCheck, Copy } from 'lucide-react'
import { Button, Field, FileDrop, Input, cn, type PickedFile } from './ui'
import { fees } from '../data/school'

export type Method = 'mtn' | 'airtel' | 'card' | 'bank'
const methods: { id: Method; label: string; sub: string; icon: typeof Smartphone }[] = [
  { id: 'mtn', label: 'MTN Mobile Money', sub: 'Approve on your phone', icon: Smartphone },
  { id: 'airtel', label: 'Airtel Money', sub: 'Approve on your phone', icon: Smartphone },
  { id: 'card', label: 'Visa or Mastercard', sub: 'Secure card page', icon: CreditCard },
  { id: 'bank', label: 'Bank transfer', sub: 'Confirmed by the bursar in 1–2 days', icon: Landmark },
]

/**
 * Payment step used by applications and parent fee payments.
 * In production: Mobile Money and cards go through the payment gateway (e.g. Flutterwave or Pesapal);
 * card numbers are only ever typed on the gateway's own page, never on ours.
 */
export function PaymentPanel({ amount, purpose, onPaid }: { amount: number; purpose: string; onPaid: (method: Method, ref: string) => void }) {
  const [method, setMethod] = useState<Method>('mtn')
  const [phone, setPhone] = useState('0772 908 114')
  const [stage, setStage] = useState<'choose' | 'waiting' | 'done'>('choose')
  const [proof, setProof] = useState<PickedFile[]>([])
  const [copied, setCopied] = useState(false)

  const pay = () => {
    setStage('waiting')
    setTimeout(() => { setStage('done'); onPaid(method, method === 'bank' ? 'Awaiting confirmation' : `MP${Date.now().toString().slice(-8)}`) }, method === 'bank' ? 600 : 2200)
  }
  const copy = () => { navigator.clipboard?.writeText(fees.bank.number.replace(/\s/g, '')).then(() => setCopied(true)).catch(() => setCopied(false)) }

  if (stage === 'done') {
    return (
      <div className="rounded-card bg-good-tint p-5 text-center">
        <CheckCircle2 className="mx-auto h-9 w-9 text-good" />
        <p className="mt-2 text-[17px] font-semibold">{method === 'bank' ? 'Proof of payment received' : 'Payment successful'}</p>
        <p className="mt-1 text-[14px] text-ink/80">{method === 'bank' ? 'The bursar will confirm the transfer within two working days. We’ll email you a receipt.' : `USD ${amount} paid for ${purpose}. A receipt has been sent to your email.`}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between gap-3 rounded-card bg-sunken px-4 py-3">
        <span className="text-[14px] text-muted">{purpose}</span>
        <span className="num text-[20px] font-semibold">USD {amount}</span>
      </div>
      <fieldset>
        <legend className="field-label">Pay with</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {methods.map((m) => (
            <label key={m.id} className={cn('flex cursor-pointer items-center gap-3 rounded-ctl border p-3 transition-colors', method === m.id ? 'border-nile bg-nile-tint/60 ring-1 ring-nile' : 'border-line bg-surface hover:border-faint')}>
              <input type="radio" name="pay-method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} className="sr-only" />
              <m.icon className="h-5 w-5 shrink-0 text-nile" />
              <span className="min-w-0"><span className="block text-[14px] font-semibold">{m.label}</span><span className="block text-[12.5px] text-muted">{m.sub}</span></span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5">
        {(method === 'mtn' || method === 'airtel') && (
          <Field label={`${method === 'mtn' ? 'MTN' : 'Airtel'} number`} htmlFor="mm-phone" hint="You’ll get a prompt on this phone. Enter your PIN there to approve. We never ask for your PIN.">
            <Input id="mm-phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
        )}
        {method === 'card' && (
          <p className="flex gap-2.5 rounded-ctl border border-line p-3 text-[14px] text-muted"><ShieldCheck className="h-5 w-5 shrink-0 text-nile" />You’ll enter your card details on our payment provider’s secure page. Roberts College never sees or stores your card number.</p>
        )}
        {method === 'bank' && (
          <div className="space-y-4">
            <dl className="grid gap-2 rounded-ctl border border-line p-4 text-[14px] sm:grid-cols-2">
              <div><dt className="text-muted">Bank</dt><dd className="font-medium">{fees.bank.name}</dd></div>
              <div><dt className="text-muted">Account name</dt><dd className="font-medium">{fees.bank.account}</dd></div>
              <div><dt className="text-muted">Account number</dt><dd className="num flex items-center gap-2 font-medium">{fees.bank.number}<button type="button" onClick={copy} className="text-nile" aria-label="Copy account number"><Copy className="h-4 w-4" /></button>{copied && <span className="text-[12px] text-good">Copied</span>}</dd></div>
              <div><dt className="text-muted">Reference</dt><dd className="font-medium">Learner’s full name</dd></div>
            </dl>
            <Field label="Upload proof of payment" hint="The bank slip or a screenshot of your transfer.">
              <FileDrop files={proof} onChange={setProof} multiple={false} compact />
            </Field>
          </div>
        )}
      </div>

      <Button size="lg" block className="mt-6" onClick={pay} disabled={stage === 'waiting' || (method === 'bank' && proof.length === 0)}>
        {stage === 'waiting' ? <><Loader2 className="h-5 w-5 animate-spin" />{method === 'card' ? 'Opening secure payment page' : method === 'bank' ? 'Sending' : 'Waiting for you to approve on your phone'}</> :
          method === 'bank' ? 'Send proof of payment' : method === 'card' ? `Pay USD ${amount} by card` : `Send payment prompt for USD ${amount}`}
      </Button>
    </div>
  )
}
