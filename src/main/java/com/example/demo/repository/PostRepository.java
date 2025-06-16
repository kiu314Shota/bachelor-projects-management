package com.example.demo.repository;

import com.example.demo.domain.Hub;
import com.example.demo.domain.Post;
import com.example.demo.domain.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface PostRepository extends CrudRepository<Post,Long> {
    List<Post> findByAuthor(User author);
    List<Post> findByHub(Hub hub);
    List<Post> findTopByOrderByUpVotesDesc();
    List<Post> findTopByOrderByDownVotesDesc();
}
