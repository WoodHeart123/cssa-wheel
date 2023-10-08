const Student = (props) => {
    return <div>
        <h2>{props.name.first} {props.name.last}</h2>
        <p>major: {props.major}</p>
        <p>number of credits: {props.numCredits}</p>
        <p>{props.fromWisconsin ? "from Wisconsin" : "not from Wisconsin"}</p>
        <p>Interests</p>
        {
            props.interests.map((interest) => {
                return <li key={interest}>{interest}</li>
            })
        }
    </div>
}

export default Student;