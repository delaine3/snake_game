import PlayerForm from '../components/PlayerForm'

const newPlayerForm = () => {
  const players = {
    player:"",
 score: ""
  }

  return <PlayerForm formId="add-player-form" PlayerForm={players} />
}

export default newPlayerForm
