import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { GlobalParamsService } from '../global-params.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})

export class UserPage implements OnInit {

  thisIsYou: boolean;
  userIsFollowing: boolean;
  uid: string;
  displayName: string;
  userId: string;
  userDisplayName: string;
  followers;
  following;
  cuFollowing;
  date: Date;
  currentTime: number;
  userProfileDoc;
  userdoc;
  userActivity;
  photoUrl;
  userPhotoUrl;
  parentTab;

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              public route: ActivatedRoute,
              private afs: AngularFirestore,
              public globalProps: GlobalParamsService,
              public toastController: ToastController) { }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
 
        this.uid = user.uid;
        this.displayName = user.displayName;
        this.photoUrl = user.photoURL;

        this.userId = this.route.snapshot.paramMap.get('id');

        if (this.uid === this.userId) {
          this.thisIsYou = true;
        }

        this.cuFollowing = this.afs.collection("users").doc(this.uid).collection("following").valueChanges()
          .subscribe(results => {
            for (let result of results) { 
              if (result.followerUid === this.uid) {
                  this.userIsFollowing = true;
              }
              else {
                this.userIsFollowing = false;
              }
            }
          })

        this.userProfileDoc = this.afs.collection("users").doc(this.userId).valueChanges();

        this.userdoc = this.afs.collection("users").doc(this.userId).ref.get().then((doc) => {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            console.log(doc.data().displayName);
            this.userDisplayName = doc.data().displayName;
            this.userPhotoUrl = doc.data().photoURL;

          } else {
            console.log("No such document!");
          }
        }).catch(function(error) {
          console.log("Error getting document:", error);
        });

        this.userActivity = this.afs.collection("users").doc(this.userId).collection("publicActivity").valueChanges()
          .subscribe(activity => this.userActivity = activity);
        
        this.followers = this.afs.collection("users").doc(this.userId).collection("followers").valueChanges();
        
        this.following = this.afs.collection("users").doc(this.userId).collection("following").valueChanges();
      }
    })
  }
 
  openArticle($event, active) {
    this.globalProps.title = active.title;
    this.globalProps.articleUrl = active.articleUrl;
    this.globalProps.publishDate = active.publishDate;
    this.globalProps.publisher = active.publisher;
    this.globalProps.titleID = active.title.replace(/[^A-Z0-9]+/ig, "-");
    this.router.navigateByUrl('tabs/' + this.globalProps.currentTab + '/article/' + this.globalProps.titleID);
  }

  openUser($event, active) {
    console.log($event, active);
    this.router.navigateByUrl('tabs/' + this.globalProps.currentTab + '/user/' + active.uid);
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000
    });
    toast.present();
  }

  follow() {   
    if (!this.userIsFollowing) {
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const followRef1 = this.afs.collection("users").doc(this.userId).collection("followers");
        followRef1.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), followerPhotoUrl: (this.photoUrl), 
                         followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followeePhotoUrl: (this.userPhotoUrl), followedIsTrue: (true) })
                         .then(()=> console.log("Following"))
                         .catch((err)=> console.log("Following Error: " + err));

      const followRef2 = this.afs.collection("users").doc(this.userId).collection("publicActivity");
      followRef2.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), followerPhotoUrl: (this.photoUrl), 
        followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followeePhotoUrl: (this.userPhotoUrl), followedIsTrue: (true) })
                       .then(()=> console.log("Following"))
                       .catch((err)=> console.log("Following Error: " + err));

      const followRef3 = this.afs.collection("users").doc(this.uid).collection("following");
      followRef3.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), followerPhotoUrl: (this.photoUrl), 
        followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followeePhotoUrl: (this.userPhotoUrl), followingIsTrue: (true) })
                       .then(()=> console.log("Following"))
                       .catch((err)=> console.log("Following Error: " + err));

      const followRef4 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
      followRef4.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), followerPhotoUrl: (this.photoUrl), 
        followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followeePhotoUrl: (this.userPhotoUrl), followingIsTrue: (true) })
                       .then(()=> console.log("Following"))
                       .catch((err)=> console.log("Following Error: " + err));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const followRef5 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          followRef5.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), followerPhotoUrl: (this.photoUrl), 
            followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followeePhotoUrl: (this.userPhotoUrl), followingIsTrue: (true) })
                           .then(()=> console.log("Following"))
                           .catch((err)=> console.log("Following Error: " + err));
        }
      })
      this.userIsFollowing = true;
      this.presentToast("Following");
    }
  }

  unFollow() {
    if (this.userIsFollowing) {

      const unFollowRef1 = this.afs.collection("users").doc(this.userId).collection("followers", ref => 
        ref.where('followerUid', '==', this.uid));
      unFollowRef1.doc().delete().then(() => console.log("unFollowed"));
      
      const unFollowRef2 = this.afs.collection("users").doc(this.userId).collection("publicActivity", ref => 
        ref.where('followerUid', '==', this.uid));
      unFollowRef2.doc().delete().then(() => console.log("unFollowed"));
      
      const unFollowRef3 = this.afs.collection("users").doc(this.uid).collection("following", ref => 
        ref.where('followeeUid', '==', this.userId));
      unFollowRef3.doc().delete().then(() => console.log("unFollowed"));
      
      const unFollowRef4 = this.afs.collection("users").doc(this.uid).collection("publicActivity", ref => 
        ref.where('followeeUid', '==', this.userId));
      unFollowRef4.doc().delete().then(() => console.log("unFollowed"));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const unFollowRef5 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity", ref => 
            ref.where('followeeUid', '==', this.userId)
               .where('followerUid', '==', this.uid));
          unFollowRef5.doc().delete().then(() => console.log("unFollowed"));
        }
      })
    }
    this.userIsFollowing = false;
    this.presentToast("Not Following");
  }

  goToFollowers() {
    this.router.navigateByUrl('tabs/user/' + this.userId + '/followers');
  }

  goToFollowing() {
    this.router.navigateByUrl('tabs/user/' + this.userId + '/following');
  }

}