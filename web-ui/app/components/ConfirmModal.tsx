interface Props {
    message: string
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmModal({ message, onConfirm, onCancel }: Props) {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-bg-surface border border-border rounded-xl p-6 w-80 flex flex-col gap-4 shadow-xl">
                <p className="text-primary text-sm">{message}</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg text-sm text-muted hover:bg-bg-elevated hover:text-primary transition"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg text-sm bg-danger text-white hover:bg-red-600 transition"
                    >
                        Удалить
                    </button>
                </div>
            </div>
        </div>
    )
}
