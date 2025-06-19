package com.example.demo.controller;

import com.example.demo.domain.Hub;
import com.example.demo.domain.Post;
import com.example.demo.domain.User;
import com.example.demo.dto.PostRequestDto;
import com.example.demo.dto.PostResponseDto;
import com.example.demo.repository.HubRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.PostService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@RestController
@RequiredArgsConstructor
@RequestMapping("/posts")
@SecurityRequirement(name = "bearerAuth")
public class PostController {

    private final PostService postService;
    private final UserRepository userRepository;
    private final HubRepository hubRepository;
    private final ModelMapper modelMapper;

    @PostMapping("/create")
    public ResponseEntity<PostResponseDto> create(@RequestBody PostRequestDto dto) {
        Post saved = postService.save(toEntity(dto));
        return ResponseEntity.ok(toDto(saved));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDto> getById(@PathVariable Long id) {
        return postService.findById(id)
                .map(post -> ResponseEntity.ok(toDto(post)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<PostResponseDto> getAll() {
        return StreamSupport.stream(postService.findAll().spliterator(), false)
                .map(this::toDto)
                .toList();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!postService.existsById(id)) return ResponseEntity.notFound().build();
        postService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/text")
    public ResponseEntity<PostResponseDto> updateText(@PathVariable Long id, @RequestParam String text) {
        return postService.updatePostText(id, text)
                .map(p -> ResponseEntity.ok(toDto(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/upvote")
    public ResponseEntity<Void> upvote(@PathVariable Long id) {
        if (!postService.existsById(id)) return ResponseEntity.notFound().build();
        postService.addUpvote(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/downvote")
    public ResponseEntity<Void> downvote(@PathVariable Long id) {
        if (!postService.existsById(id)) return ResponseEntity.notFound().build();
        postService.addDownVote(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/author/{authorId}")
    public List<PostResponseDto> getByAuthor(@PathVariable Long authorId) {
        User user = userRepository.findById(authorId).orElseThrow();
        return postService.findByAuthor(user).stream().map(p -> toDto(p)).toList();
    }

    @GetMapping("/hub/{hubId}")
    public List<PostResponseDto> getByHub(@PathVariable Long hubId) {
        Hub hub = hubRepository.findById(hubId).orElseThrow();
        return postService.findByHub(hub).stream().map(p -> toDto(p)).toList();
    }

    @GetMapping("/top")
    public List<PostResponseDto> getTopPosts(@RequestParam(defaultValue = "10") int limit) {
        return postService.findTopPostsByUpVotes(limit).stream().map(p -> toDto(p)).toList();
    }

    @GetMapping("/recent")
    public List<PostResponseDto> getRecentPosts(@RequestParam(defaultValue = "10") int limit) {
        return postService.findRecentPosts(limit).stream().map(p -> toDto(p)).toList();
    }


    private PostResponseDto toDto(Post post) {
        PostResponseDto dto = modelMapper.map(post, PostResponseDto.class);
        if (post.getComments() != null)
            dto.setCommentIds(post.getComments().stream().map(c -> c.getId()).toList());
        return dto;
    }

    private Post toEntity(PostRequestDto dto) {
        Post post = new Post();
        post.setText(dto.getText());
        post.setAuthor(userRepository.findById(dto.getAuthorId()).orElseThrow());
        post.setHub(hubRepository.findById(dto.getHubId()).orElseThrow());
        return post;
    }
}
