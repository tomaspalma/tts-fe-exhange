import { NitSigIcon } from '../../../svgs'

type Props = {}

/**
 * Future feature that allows the user to export his schedule options to NitSig
 */
const NitSigExport = () => {
  return (
    <button
      onClick={() => {}}
      title="Disponível em breve"
      className="group flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      <NitSigIcon className="h-4 w-4" />
      <span>Exportar para o NitSig</span>
    </button>
  )
}

export default NitSigExport
