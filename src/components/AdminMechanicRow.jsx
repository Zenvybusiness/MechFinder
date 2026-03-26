// Inspired by react-hot-toast library
import { useState, useEffect } from "react";

const TOAST_LIMIT = 20;
const TOAST_REMOVE_DELAY = 1000000;

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const toastTimeouts = new Map();

const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

const _clearFromRemoveQueue = (toastId) => {
  const timeout = toastTimeouts.get(toastId);
  if (timeout) {
    clearTimeout(timeout);
    toastTimeouts.delete(toastId);
  }
};

export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners = [];

let memoryState = { toasts: [] };

function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function toast({ ...props }) {
  const id = genId();

  const update = (props) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    });

  const dismiss = () =>
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = useState(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  };
}

export { useToast, toast }; import { Button } from '@/components/ui/button';
import { Check, X, Trash2, CreditCard, Phone } from 'lucide-react';

export default function AdminMechanicRow({ mechanic, onApprove, onReject, onDelete, onTogglePayment }) {
  const m = mechanic;

  const statusStyle = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    approved: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
  };

  const paymentStyle = {
    paid: 'bg-green-50 text-green-700 border-green-200',
    unpaid: 'bg-orange-50 text-orange-700 border-orange-200',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 px-6 py-4 hover:bg-secondary/40 transition-colors items-center">
      <div className="lg:col-span-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full border border-border bg-secondary overflow-hidden shrink-0">
          {m.profile_photo ? (
            <img src={m.profile_photo} alt="" className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary font-heading font-bold text-sm">
              {m.name?.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="font-heading font-semibold text-sm text-foreground">{m.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Phone className="w-3 h-3" /> {m.phone}
          </p>
        </div>
      </div>

      <div className="lg:col-span-2">
        <p className="text-sm text-foreground font-medium">{m.shop_name}</p>
        <p className="text-xs text-muted-foreground lg:hidden">{m.city} — {m.pin_code}</p>
      </div>

      <div className="hidden lg:block lg:col-span-2">
        <p className="text-sm text-foreground">{m.city}</p>
        <p className="text-xs text-muted-foreground">{m.pin_code}</p>
      </div>

      <div className="lg:col-span-1">
        <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border ${statusStyle[m.status] || ''}`}>
          {m.status?.charAt(0).toUpperCase() + m.status?.slice(1)}
        </span>
      </div>

      <div className="lg:col-span-1">
        <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border ${paymentStyle[m.payment_status] || ''}`}>
          {m.payment_status?.charAt(0).toUpperCase() + m.payment_status?.slice(1)}
        </span>
      </div>

      <div className="lg:col-span-3 flex items-center gap-1.5 flex-wrap">
        {m.status !== 'approved' && (
          <Button size="sm" onClick={onApprove} className="h-7 px-2.5 text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg">
            <Check className="w-3 h-3 mr-1" /> Approve
          </Button>
        )}
        {m.status !== 'rejected' && (
          <Button size="sm" variant="outline" onClick={onReject} className="h-7 px-2.5 text-xs rounded-lg">
            <X className="w-3 h-3 mr-1" /> Reject
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={onTogglePayment} className="h-7 px-2.5 text-xs rounded-lg">
          <CreditCard className="w-3 h-3 mr-1" /> {m.payment_status === 'paid' ? 'Unpay' : 'Mark Paid'}
        </Button>
        <Button size="sm" variant="destructive" onClick={onDelete} className="h-7 px-2.5 text-xs rounded-lg">
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}