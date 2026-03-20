import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Char "mo:core/Char";
import List "mo:core/List";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type ExamType = {
    #class10;
    #class12;
    #jee;
    #neet;
    #upsc;
  };

  type ChatMessage = {
    question : Text;
    answer : Text;
    timestamp : Time.Time;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Note = {
    title : Text;
    content : Text;
    subject : Text;
    topic : Text;
  };

  type QuizAttempt = {
    score : Nat;
    subject : Text;
    topic : Text;
    questionsAnswered : Nat;
  };

  type StudySession = {
    subject : Text;
    durationMinutes : Nat;
    date : Time.Time;
  };

  module Note {
    public func compare(note1 : Note, note2 : Note) : Order.Order {
      Text.compare(note1.title, note2.title);
    };
  };

  type UserProfile = {
    name : Text;
    examType : ExamType;
    subjects : [Text];
  };

  module UserProfile {
    public func compare(profile1 : UserProfile, profile2 : UserProfile) : Order.Order {
      switch (Text.compare(profile1.name, profile2.name)) {
        case (#equal) { Int.compare(profile1.subjects.size().toInt(), profile2.subjects.size().toInt()) };
        case (order) { order };
      };
    };
  };

  type UserData = {
    profile : UserProfile;
    chats : List.List<ChatMessage>;
    notes : List.List<Note>;
    quizzes : List.List<QuizAttempt>;
    sessions : List.List<StudySession>;
  };

  let users = Map.empty<Principal, UserData>();

  func getOrCreateUser(caller : Principal) : UserData {
    switch (users.get(caller)) {
      case (?user) { user };
      case (null) {
        let newUser = {
          profile = {
            name = "";
            examType = #class10;
            subjects = [];
          };
          chats = List.empty<ChatMessage>();
          notes = List.empty<Note>();
          quizzes = List.empty<QuizAttempt>();
          sessions = List.empty<StudySession>();
        };
        users.add(caller, newUser);
        newUser;
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("This user is not registered.") };
      case (?user) { user.profile };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (users.get(user)) {
      case (null) { Runtime.trap("This user is not registered.") };
      case (?user) { user.profile };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let user = getOrCreateUser(caller);
    let updatedUser = {
      user with
      profile;
    };
    users.add(caller, updatedUser);
  };

  public shared ({ caller }) func addChatMessage(question : Text, answer : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add chat messages");
    };
    let user = getOrCreateUser(caller);
    let newChat = {
      question;
      answer;
      timestamp = Time.now();
    };
    user.chats.add(newChat);
    users.add(caller, user);
  };

  public query ({ caller }) func getChatHistory() : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access chat history");
    };
    switch (users.get(caller)) {
      case (null) { [] };
      case (?user) { user.chats.toArray() };
    };
  };

  public shared ({ caller }) func addNote(note : Note) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add notes");
    };
    let user = getOrCreateUser(caller);
    user.notes.add(note);
    users.add(caller, user);
  };

  public query ({ caller }) func getNotes() : async [Note] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access notes");
    };
    switch (users.get(caller)) {
      case (null) { [] };
      case (?user) { user.notes.toArray().sort() };
    };
  };

  public query ({ caller }) func searchNotes(searchTerm : Text) : async [Note] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search notes");
    };
    let lowerTerm = searchTerm.map(
      func(c) {
        if (c >= 'A' and c <= 'Z') {
          Char.fromNat32(c.toNat32() + 32);
        } else { c };
      }
    );

    let matchingNotes = List.empty<Note>();

    func helper(notesIter : Iter.Iter<Note>) {
      switch (notesIter.next()) {
        case (null) {};
        case (?note) {
          let lowerTitle = note.title.map(
            func(c) {
              if (c >= 'A' and c <= 'Z') {
                Char.fromNat32(c.toNat32() + 32);
              } else { c };
            }
          );
          let lowerContent = note.content.map(
            func(c) {
              if (c >= 'A' and c <= 'Z') {
                Char.fromNat32(c.toNat32() + 32);
              } else { c };
            }
          );
          if (lowerTitle.contains(#text lowerTerm) or
              lowerContent.contains(#text lowerTerm)) {
            matchingNotes.add(note);
          };
          helper(notesIter);
        };
      };
    };

    switch (users.get(caller)) {
      case (null) { [] };
      case (?user) {
        helper(user.notes.values());
        matchingNotes.toArray().sort();
      };
    };
  };

  public shared ({ caller }) func addQuizAttempt(quiz : QuizAttempt) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add quiz attempts");
    };
    let user = getOrCreateUser(caller);
    user.quizzes.add(quiz);
    users.add(caller, user);
  };

  public query ({ caller }) func getQuizAttempts() : async [QuizAttempt] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access quiz attempts");
    };
    switch (users.get(caller)) {
      case (null) { [] };
      case (?user) { user.quizzes.toArray() };
    };
  };

  public shared ({ caller }) func addStudySession(session : StudySession) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add study sessions");
    };
    let user = getOrCreateUser(caller);
    user.sessions.add(session);
    users.add(caller, user);
  };

  public query ({ caller }) func getStudySessions() : async [StudySession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access study sessions");
    };
    switch (users.get(caller)) {
      case (null) { [] };
      case (?user) { user.sessions.toArray() };
    };
  };

  public query ({ caller }) func getAllStudySessions(userId : Principal) : async [StudySession] {
    if (not AccessControl.isAdmin(accessControlState, caller) and caller != userId) {
      Runtime.trap("Unauthorized: Only admins can get other users' study sessions");
    };
    switch (users.get(userId)) {
      case (null) { [] };
      case (?user) { user.sessions.toArray() };
    };
  };

  public shared ({ caller }) func deleteNote(title : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete notes");
    };
    switch (users.get(caller)) {
      case (null) {
        Runtime.trap("This user does not exist.");
      };
      case (?user) {
        let filteredNotes = user.notes.filter(
          func(n) { n.title != title }
        );
        let updatedUser = { user with notes = filteredNotes };
        users.add(caller, updatedUser);
      };
    };
  };

  public shared ({ caller }) func updateNote(updatedNote : Note) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update notes");
    };
    switch (users.get(caller)) {
      case (null) {
        Runtime.trap("This user does not exist.");
      };
      case (?user) {
        let filteredNotes = user.notes.filter(
          func(n) { n.title != updatedNote.title }
        );
        filteredNotes.add(updatedNote);
        let updatedUser = { user with notes = filteredNotes };
        users.add(caller, updatedUser);
      };
    };
  };

  public query ({ caller }) func getAllNotes(userId : Principal) : async [Note] {
    if (not AccessControl.isAdmin(accessControlState, caller) and caller != userId) {
      Runtime.trap("Unauthorized: Only admins can get other users' notes");
    };
    switch (users.get(userId)) {
      case (null) { [] };
      case (?user) { user.notes.toArray().sort() };
    };
  };

  public query ({ caller }) func getStats(userId : Principal) : async {
    totalSessions : Nat;
    avgScore : Nat;
    notesCount : Nat;
    chatCount : Nat;
  } {
    if (not AccessControl.isAdmin(accessControlState, caller) and caller != userId) {
      Runtime.trap("Unauthorized: Only admins can get other users' stats");
    };
    switch (users.get(userId)) {
      case (null) {
        {
          totalSessions = 0;
          avgScore = 0;
          notesCount = 0;
          chatCount = 0;
        };
      };
      case (?user) {
        let scores = user.quizzes.toArray();
        let avgScore = if (scores.size() > 0) {
          scores.foldLeft(
            0,
            func(acc, q) { acc + q.score },
          ) / scores.size();
        } else { 0 };
        {
          totalSessions = user.sessions.size();
          avgScore;
          notesCount = user.notes.size();
          chatCount = user.chats.size();
        };
      };
    };
  };

  public query ({ caller }) func getAllUserProfiles() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can get all user profiles");
    };
    users.values().toArray().map(
      func(user) { user.profile }
    ).sort();
  };

  public shared ({ caller }) func clearUserData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear their own data");
    };
    let user = getOrCreateUser(caller);
    let newUser = {
      user with
      chats = List.empty<ChatMessage>();
      notes = List.empty<Note>();
      quizzes = List.empty<QuizAttempt>();
      sessions = List.empty<StudySession>();
    };
    users.add(caller, newUser);
  };
};
