import PlayerForm from '../components/PlayerForm'

const newPlayerForm = () => {
  const players = {
    player:"",
    player2:"",
    winner:""
  }

  return <PlayerForm formId="add-player-form" PlayerForm={players} />
}

export default newPlayerForm
