// storing the backend token in the session to be used in the frontend Technology.
register() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${sessionStorage.getItem('token')}`);
               console.log(this.fdata.value)
    this.http.post('http://127.0.0.1:8000/api/register', this.fdata.value, { headers }).subscribe({
      next: (res) => {
        alert('Registered Successfully')
      }, error: (er) =>
        console.log(er)
    }
    )
  }
