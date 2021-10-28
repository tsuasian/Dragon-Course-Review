// TypeAheadDropDown.js
import React from 'react';
import './css/TypeAheadSearch.css'
import { TextField, List, ListItem, ListItemText, ListSubheader } from '@material-ui/core'
import { Redirect } from "react-router-dom";
var test = ["Mark Boady", "Gregory Hislop", "Jeff Salvage"]
export default class TypeAheadSearch extends React.Component {
 constructor(props) {
   super(props);
   this.state = {
     suggestions: [],
     professors: [],
     courses: [],
     profs: [],
     text:'',
     nav: false,
     dest: "/home"
   }
	 this.onTextChange = this.onTextChange.bind(this);
	 this.suggestionSelected = this.suggestionSelected.bind(this);
	 this.renderSuggestions = this.renderSuggestions.bind(this);
	 this.handleKeyDown = this.handleKeyDown.bind(this);
 }


 componentDidMount() {
 	fetch('http://localhost:3000/search/get_courses')
                .then((res) => res.json())
                .then((res) => {
			console.log(res[0].name);
                        this.setState({
                                courses: res
                        });
                });
        fetch('http://localhost:3000/search/get_instructors')
                .then((res) => res.json())
                .then((res)=>{
                        this.setState({
                                profs: res
                        });
                });
 }

 onTextChange(e){
   const items = this.state.courses;
   const profs = this.state.profs;
   let suggestions = [];
   let professors = [];
   const value = e.target.value;
   if (value.length > 0) {
     suggestions = items.filter(v => v.name.toLowerCase().includes(value.toLowerCase()) || v.title.toLowerCase().includes(value.toLowerCase()));
     professors = profs.filter(v => v.name.toLowerCase().includes(value.toLowerCase()));
     console.log("Profs:", profs)
     console.log("Professors:", professors)
   }


   this.setState(() => ({
     suggestions,
     professors,
     text:value
   }));
 }
 
 suggestionSelected(suggest, type){
	if(type == 0){
		this.setState(()=>({
			text:suggest.title + " - " + suggest.name,
			professors:[],
			suggestions:[],
			dest: "/course?name=" + suggest.name,
			nav:true
		}));
	}
	if(type == 1){
                this.setState(()=>({
                        text:suggest.name,
                        professors:[],
                        suggestions:[],
                        dest: "/survey_table?inst_id=" + suggest._id,
                        nav:true
                }));
        }

 }

 handleKeyDown = (e) => {
	if (e.key === 'Enter') {
		this.setState(()=>({
			dest: "/results?name=" + this.state.text,
			nav: true
		}));
        }
  }

 renderSuggestions(){
   const { suggestions } = this.state;
   const { professors } = this.state;
   console.log("suggestions :",suggestions);
   if ((suggestions.length+professors.length) === 0) {
     return null;
   }
   return (
     <List className="suggestList" maxheight={300}>
	   <ListSubheader><b>Courses</b></ListSubheader>
       {suggestions.map(suggest => <ListItem key={suggest._id} className="items" onClick={(e)=>this.suggestionSelected(suggest, 0)}><ListItemText primary={suggest.title + " - " + suggest.name}/></ListItem>)}
	   <ListSubheader><b>Professors</b></ListSubheader>
       {professors.map(prof => <ListItem key={prof} className="items" onClick={(e)=>this.suggestionSelected(prof, 1)}><ListItemText primary={prof.name}/></ListItem>)}
     </List>
   )
 }


 render() {
   const {text}=this.state
   const {nav} =this.state
   const inputProps = {
    onChange: this.onTextChange,
    onKeyDown: this.handleKeyDown,
    placeholder: "Search for a course or professor",
    value: text,
    type:"text",
    size:"small",

   }
   if (nav){return <Redirect push={true} to={this.state.dest}/>}
   return (
   <div align="center" className="TypeAheadDropDown">
      <TextField
            className="TypeAheadDropDown1" 
            variant="outlined"
            InputProps={{ ...inputProps}}
        />
     {this.renderSuggestions()}
   </div>
   );
 }

}
