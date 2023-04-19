import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Comment } from '../../../shared/models/Comment';
import { Image } from '../../../shared/models/Image';
import { User } from '../../../shared/models/User';
import { ShopService } from '../../../shared/services/shop.service';
import { CommentService } from '../../../shared/services/comment.service';
import { UserService } from '../../../shared/services/user.service';
import { JewelleryService } from '../../../shared/services/jewellery.service';


import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnChanges {

  @Input() imageInput?: Image;
  loadedImage?: string;
  user?: User;

  adminUser?: User;

  comments: Array<Comment> = [];

  commentsForm = this.createForm({
    id: '',
    username: '',
    comment: '',
    date: 0,
    imageId: this.imageInput?.id
  });

  constructor(private formBuilder: FormBuilder, private router: Router, 
    private shopService: ShopService, private commentService: CommentService, 
    private userService: UserService, private jewelleryService: JewelleryService, 
    private toastr: ToastrService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.imageInput?.id) {
      this.commentsForm.get('imageId')?.setValue(this.imageInput.id);
      this.shopService.loadImage(this.imageInput?.photo_location).subscribe((data) => {
        this.loadedImage = data;
      });
      this.commentService.getCommentsByImageId(this.imageInput.id).subscribe(comments => {
        this.comments = comments;
      });
    }
  }

  increasePrice(){
    if (this.imageInput) {
      const increase = 1.1;
      this.imageInput.price = Math.round(Number(this.imageInput.price.split(' ')[0]) * increase) + " Ft";
      this.jewelleryService.update(this.imageInput).then(_ => {
        this.toastr.success('Sikeres 10%-os árnövelés az adott terméken', 'Áremelés');
      }).catch(error => {
        console.error(error);
      });
    }
  }

  decreasePrice(){
    if (this.imageInput) {
      const increase = 0.9;
      this.imageInput.price = Math.round(Number(this.imageInput.price.split(' ')[0]) * increase) + " Ft";
      this.jewelleryService.update(this.imageInput).then(_ => {
        this.toastr.success('Sikeres 10%-os árcsökkentés az adott terméken', 'Árcsökkentés');
      }).catch(error => {
        console.error(error);
      });
    }
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
    this.userService.getById(user.uid).subscribe(data =>{
      this.user = data;
      this.commentsForm.get('username')?.setValue(this.user?.username as string);
      if (this.commentsForm.get('username')?.value?.includes('admin')) {
        this.adminUser = data;
      }
    }, error => {
      console.error(error);
    });
  }

  createForm(model: Comment) {
    let formGroup = this.formBuilder.group(model);
    formGroup.get('username')?.addValidators([Validators.required]);
    formGroup.get('comment')?.addValidators([Validators.required, Validators.minLength(8), Validators.maxLength(1000)]);
    return formGroup;
  }

  addComment() {
    if (!this.commentsForm.valid) {
      if (this.commentsForm.get('username')?.value === '' || this.commentsForm.get('comment')?.value === '') {
        this.toastr.error('Minden mezőt ki kell tölteni!', 'Hozzászólás hiba!');
        return;
      }
      this.toastr.error('A hozzászólásnak legalább 8 karakter hosszúnak kell lennie!', 'Hozzászólás hiba!');
    }

    if (this.commentsForm.valid) {
      if (this.commentsForm.get('username') && this.commentsForm.get('comment')) {
        this.commentsForm.get('date')?.setValue(new Date().getTime());
      
        this.commentService.create(this.commentsForm.value as Comment).then(_ => {
          this.toastr.success('Hozzászólás sikeres volt', 'Hozzászólás');
          this.router.navigateByUrl('/shop');
        }).catch(error => {
          console.error(error);
        });
      }
    }
  }

  deleteComment(commentId: string, username: string){
    if(username === this.user?.username){
      this.toastr.success('Sikeresen törölted a hozzászólásodat', 'Hozzászólás');
      this.commentService.delete(commentId);
    } else {
      this.toastr.error('Más hozzászólását nem törölheted!', 'Hozzászólás hiba!');
    }
  }

  addToCart() {
    this.toastr.success(this.imageInput?.name + ' sikeresen a kosárba került!', 'Kosár');
  }
}
